const { Router } = require('express')
const path = require('path')
var fs = require('fs');
const moment = require('moment')

const configuracion = require('../config/config')

var csv = require("csvtojson")
const Route = Router()

Route.get('/', (req, res) => {
    res.render('input');
})
    .get('/db', (req, res) => {
        res.render('index')
    })

    .post('/creardb', configuracion.single('file'), (req, res) => {
        if (req.file) {
            res.render('index')
        } else {
            res.render('index')
        }

    })

    .post('/validar', (req, res) => {
        const { cedula } = req.body

        if (fs.existsSync('src/temp/Basededatos.csv')) {

            var filePath = path.join(__dirname, '../temp/Basededatos.csv');

            csv()
                .fromFile(filePath)
                .then(function (jsonArrayObj) {
                    let consultados = []
                    for (const usuario in jsonArrayObj) {
                        if (jsonArrayObj[usuario].NumeroDocumento == cedula) {
                            consultados.push(jsonArrayObj[usuario])
                        }
                    }
                    if (consultados.length > 1) {
                        let Total = [];
                        Total = consultados.reduce((acumulador, valorActual) => {
                            const elementoYaExiste = acumulador.find(elemento => moment(elemento.Date).day() === moment(valorActual.Date).day());
                            if (elementoYaExiste) {
                                return acumulador.map((elemento) => {
                                    if (moment(elemento.Date).day() === moment(valorActual.Date).day()) {

                                        return {
                                            ...elemento,
                                        }
                                    }
                                    return elemento;
                                });
                            }
                            return [...acumulador, valorActual];
                        }, []);
                        if (Total.length > 0) {
                            res.pdfFromHTML({
                                filename: 'generated.pdf',
                                htmlContent: `
                                        <html>
                                        <head>
                                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
                                        <style>
                                        *{
                                            margin: 0%;
                                            padding: 0%;
                                        }
                                        .principal{
                                            background:url('http://www.vcongresonacionaldederechodisciplinario.com/wp-content/uploads/2021/05/Certificado_V_Congreso_DD-01.jpg') ;
                                            background-size: 92%;
                                            background-repeat:no-repeat;
                                        }
                                        .textos{
                                            position: absolute;
                                            top: 210px;
                                            width: 100%;
                                        }
                                        .txts{
                                            color:#5f6e7c;
                                            position: relative;
                                            left: 2%
                                        }
                                        
                                    </style>
                                </head>
                                <body>
                                <div class="principal h-100 justify-content-center ">
                                    <div class="textos  translate-middle  text-center">
                                        <div class="txts col-12">
                                            <h1>${Total[0].Name}</h1>
                                        </div>
                                        <div class="txts col-12 ">
                                            <h1>${cedula}</h1>
                                        </div>
                                    </div>
                                </div>
                                </body>
                                        </html> 
                                
                                        `,

                                options: { "orientation": "landscape" }
                            });

                        } else {
                            res.render('input', { error: 'esta cedula no cumple los requisitos para obtener el certificado' })
                        }
                    } else {
                        res.render('input', { error: 'esta cedula no cumple los requisitos para obtener el certificado' })
                    }
                })
        }
        else {
            console.log("El archivo NO EXISTE!");
        }
    })

module.exports = Route