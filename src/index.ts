import venom, { Message, Whatsapp, create } from "venom-bot"
import express, {Request, Response, response} from 'express';
import http, { Server } from "http"
const app = express();
const port = 8000;
const server = http.createServer(app);
import { body, validationResult } from 'express-validator';
import { json } from "stream/consumers";
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
  
  create({  
    session: "39857 - Paroquia Exclusiva de Desenvolvimento",
    disableWelcome: true,
    //headless: false
  })
  .then(
    async (client: Whatsapp) => start(client)
  )
  .catch((err) =>  { 
    console.log(err) 
  })

  function start(client: Whatsapp) {

    const AVISOMESSAGE = "🚨 *IMPORTANTE!!!* 🚨 \n\n" +
    "Esta é uma mensagem *AUTOMÁTICA*. \n" + 
    "Para entrar em contato conosco, pedimos que use " +
    "os canais oficiais de atendimento ao cliente:  \n\n" + 
    "Telefone: *(44) 99816-9553*.  \n" + 
    "Email: *bruno@dunnamistech.com.br*.  \n\n" + 
    "OBRIGADO.";

    client.onMessage((message) => {
      if (message.body === 'Ual' && message.isGroupMsg === false) {
        client.sendText(message.from, AVISOMESSAGE)
          .then((result) => {
            console.log('Result: ', result); //return object success
          })
          .catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
          });
      }
    });

    app.post('/send-message',     
      [body('number').notEmpty(), 
       body('message').notEmpty()], 
       async (req: Request, res: Response) => {
        const errors = validationResult(req).formatWith(({
          msg 
        }) => {
          return msg
      });
        
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.mapped()
          })
        }

        const number = req.body.number + "@c.us";
        const message = req.body.message;

        client
        .sendText(number, message)
        .then(response => {
          res.status(200).json({
            status: true,
            message: "Mensagem enviada",
            response: response
          })
        })
        .catch(error => {
          res.status(500).json({
            status: false,
            message: "Mensagem não enviada",
            response: error.text
          })
        })   
    })

    app.post('/send-invitation-pnet', 
      [body('number').notEmpty(), 
       body('link').notEmpty(), 
       body('descriptionlink').notEmpty(), 
       body('message').notEmpty()], 
       async (req: Request, res: Response) => {
        const errors = validationResult(req).formatWith(({
          msg 
        }) => {
          return msg
        });
        
        if (!errors.isEmpty()){
          return res.status(400).json({
            status: false,
            message: errors.mapped()
          })
        }

      const number = req.body.number + "@c.us";
      const link = req.body.link;
      const descriptionlink = req.body.descriptionlink;
      const message = req.body.message;

      client
      .sendLinkPreview(number, link, descriptionlink)
      .then(response => {
        res.status(200).json({
          status: true,
          message: "Mensagem enviada",
          response: response
        })
      })
      .catch(error => {
        res.status(500).json({
          status: false,
          message: "Mensagem não enviada",
          response: error.text
        })
      })
      
      client
      .sendText(number, message)
      .then(response => {
        res.status(200).json({
          status: true,
          message: "Mensagem enviada",
          response: response
        })
      })
      .catch(error => {
        res.status(500).json({
          status: false,
          message: "Mensagem não enviada",
          response: error.text
        })
      })
        
    })

    app.post('/send-image-fromBase64',     
      [body('number').notEmpty(), 
       body('imageBase64').notEmpty(),
       body('fileName').notEmpty()], 
       async (req: Request, res: Response) => {
        const errors = validationResult(req).formatWith(({
          msg 
        }) => {
          return msg
      });
        
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.mapped()
          })
        }

        const number = req.body.number + "@c.us";
        const fileName = req.body.fileName;
        const imageBase64 = req.body.imageBase64
          
    
        client
        .sendImageFromBase64(number, imageBase64, fileName)
        .then(response => {
          res.status(200).json({
            status: true,
            message: "Mensagem enviada",
            response: response
          })
        })
        .catch(error => {
          res.status(500).json({
            status: false,
            message: "Mensagem não enviada",
            response: error.text
          })
        })   
    })

    app.post('/send-image',     
    [body('number').notEmpty(),      
     body('captionText').notEmpty(),      
     body('fileName').notEmpty()], 
     async (req: Request, res: Response) => {
      const errors = validationResult(req).formatWith(({
        msg 
      }) => {
        return msg
    });
      
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: false,
          message: errors.mapped()
        })
      }

      const number = req.body.number + "@c.us";
      const fileName = req.body.fileName;
      const captionText = req.body.captionText

      let filePath = "/Users/brunoruiz/Projects/FuturosProjetos/Bruno/WhatsAppApi/docs/demo.png";
        
  
      client
      .sendImage(number, filePath, fileName, captionText)
      .then(response => {
        res.status(200).json({
          status: true,
          message: "Mensagem enviada",
          response: response
        })
      })
      .catch(error => {
        res.status(500).json({
          status: false,
          message: "Mensagem não enviada",
          response: error.text
        })
      })   
    })

    app.post('/send-poll-creation',     
    [body('number').notEmpty(),           
     body('survey').notEmpty()], 
     async (req: Request, res: Response) => {
      const errors = validationResult(req).formatWith(({
        msg 
      }) => {
        return msg
    });
      
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: false,
          message: errors.mapped()
        })
      }

      const number = req.body.number + "@c.us";
      const survey = JSON.stringify(req.body.survey);
      const optionsCount = req.body.optionsCount


      const poll = {
        name: 'new poll',
        options: [
          {
            name: 'option 1'
          },
          {
            name: 'option 2'
          }
        ],
        selectableOptionsCount: 1
      };
        
      client.sendPollCreation(number, poll)
      .then(response => {
        res.status(200).json({
          status: true,
          message: "Mensagem enviada",
          response: response
        })
      })
      .catch(error => {
        res.status(500).json({
          status: false,
          message: "Mensagem não enviada",
          response: error.text
        })
      })   
    })

    app.post('/send-list-menu',     
    [body('number').notEmpty(),
     body('title').notEmpty(),
     body('subTitle').notEmpty(),
     body('description').notEmpty(),
     body('buttonText').notEmpty()],
     async (req: Request, res: Response) => {
      const errors = validationResult(req).formatWith(({
        msg 
      }) => {
        return msg
    });
      
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: false,
          message: errors.mapped()
        })
      }

      const number = req.body.number + "@c.us";
      const title = req.body.title;
      const subTitle = req.body.subTitle;
      const description = req.body.description;
      const buttonText = req.body.buttonText;


      // Send List menu
      const list = [
        {
          title: "Sistemas de Gestão Eclesial",
          rows: [
            {
              title: "Eclesial",
              description: "Sistema completo de gestão pastoral",
            }
          ]
        },
        {
          title: "Aplicativos",
          rows: [
            {
              title: "ParoquiaNet",
              description: "Aplicativo para Fieis da sua paroquia",
            },
            {
              title: "EclesialCard",
              description: "Solução completa para recebimentos em sua paróquia",
            }
          ]
        }
      ];
        
      client.sendListMenu(number, title, subTitle, description, buttonText, list)
      .then(response => {
        res.status(200).json({
          status: true,
          message: "Mensagem enviada",
          response: response
        })
      })
      .catch(error => {
        res.status(500).json({
          status: false,
          message: "Mensagem não enviada",
          response: error.text
        })
      })   
    })

    app.post('/send-buttons',     
    [body('number').notEmpty(),
     body('title').notEmpty(),
     body('subTitle').notEmpty()],
     async (req: Request, res: Response) => {
      const errors = validationResult(req).formatWith(({
        msg 
      }) => {
        return msg
    });
      
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: false,
          message: errors.mapped()
        })
      }

      const number = req.body.number + "@c.us";
      const title = req.body.title;
      const subTitle = req.body.subTitle;


      // Send Messages with Buttons Reply
      const buttons = [
        {
          "buttonText": {
            "displayText": "Text of Button 1"          
            }
          },
        {
          "buttonText": {
            "displayText": "Text of Button 2"
            }
          }
        ]
        
      client.sendButtons(number, title, "tste", buttons)
      .then(response => {
        res.status(200).json({
          status: true,
          message: "Mensagem enviada",
          response: response
        })
      })
      .catch(error => {
        res.status(500).json({
          status: false,
          message: "Mensagem não enviada",
          response: error.text
        })
      })   
    })

    app.post('/send-file-fromBase64',     
    [body('number').notEmpty(),
     body('fileName').notEmpty(),
     body('caption').notEmpty(),
     body('fileBase64').notEmpty()],
     async (req: Request, res: Response) => {
      const errors = validationResult(req).formatWith(({
        msg 
      }) => {
        return msg
    });
      
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: false,
          message: errors.mapped()
        })
      }

      const number = req.body.number + "@c.us";
      const fileName = req.body.fileName;
      const caption = req.body.caption;
      const fileBase64 = req.body.fileBase64;

        
      client.sendFileFromBase64(number, fileBase64, fileName, caption)
      .then(response => {
        res.status(200).json({
          status: true,
          message: "Mensagem enviada",
          response: response
        })
      })
      .catch(error => {
        res.status(500).json({
          status: false,
          message: "Mensagem não enviada",
          response: error.text
        })
      })   
    })

    app.post('/send-file',     
    [body('number').notEmpty(),
     body('fileName').notEmpty(),
     body('caption').notEmpty(),
     body('filePath').notEmpty()],
     async (req: Request, res: Response) => {
      const errors = validationResult(req).formatWith(({
        msg 
      }) => {
        return msg
    });
      
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: false,
          message: errors.mapped()
        })
      }

      const number = req.body.number + "@c.us";
      const fileName = req.body.fileName;
      const caption = req.body.caption;
      const filePath = req.body.filePath;
      
      client.sendFile(number, filePath, fileName, caption)
      .then(response => {
        res.status(200).json({
          status: true,
          message: "Mensagem enviada",
          response: response
        })
      })
      .catch(error => {
        res.status(500).json({
          status: false,
          message: "Mensagem não enviada",
          response: error.text
        })
      })   
    })

   


  }

  server.listen(port, function () {
    console.log("App running on : " + port);
  });
