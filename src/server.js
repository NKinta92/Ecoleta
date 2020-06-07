const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db")

//configurar pasta public
server.use(express.static("public"))

//Habilitar o uso de req.body na nossa app
server.use(express.urlencoded({ extended: true }))

//utilizando template engine
const nunjucks = require ("nunjucks")
nunjucks.configure("src/views",{
    express: server,
    noCache: true
})

//configurar caminhos na minha aplicacao
//pagina inicial
//req-requesicao  res-resposta
server.get("/", (req, res) => { 
    //res.send("pagina index")
    return res.render("index.html")
})


server.get("/create-point", (req, res) => {
    // req.query: Query Strings da nossa url
    //console.log(req.query)

    //res.send("pagina index")
    return res.render("create-point.html")
})

server.post("/save-point", (req, res) => {
    // req.body: Query Strings da nossa url
    //console.log(req.body)

    // Inserir dados no banco de dados
    const query = `
            INSERT INTO places (
                image,
                name,
                address,
                address2,
                state,
                city,
                items 
            ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no Cadastro")
        }

        //res.send("pagina index")
        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)
})


server.get("/search", (req, res) => { 

    const search = req.query.search


    if (search == "") {
        //pesquisa vazia
        return res.render("search-results.html", { total: 0 })
    }
    //pegar os dados da base de dados

    // 3 consultar os dados da tabela
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length

        //res.send("pagina index")
        //Mostrar pagina html com os dados da base de dados
        return res.render("search-results.html", { places: rows, total })
    })
})

//ligar o servidor
server.listen(3000)