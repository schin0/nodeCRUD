// Express:
const express = require('express');
// Cors:
const cors = require('cors');
// Firebase:
const firebase = require('firebase');

const swaggerUi = require('swagger-ui-express');

const swaggerJson = require('./swagger.json');

// Configuração do Firebase
const firebaseConfig = require('./nodeprojectimersao-firebase-adminsdk-dyqac-325ba48a24.json');

// Inicializando o firebase a partir das configurações:
firebase.initializeApp(firebaseConfig);

// Firestore:
const db = firebase.firestore();

// Criação da coleção carros:
const Carro = db.collection('carros');

var bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(4000, () => {
      console.log('servidor rodando na porta 4000')
});

app.use('/documentacao', swaggerUi.serve, swaggerUi.setup(swaggerJson));

app.get("/retornoJSON", (request, response) => {
      return response.json({ message: "Hello" });
});

// Definimos a rota desejada (/carros) e retornamos os dados desejados
app.get("/carros", async (request, response) => {
      const snapshot = await Carro.get();
      const carros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      response.send(carros);
});

app.get("/:id", async (request, response) => {
      const { id } = request.params;
      const snapshot = await Carro.get();
      const carros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const carro = carros.filter(c => {
            return c.id == id;
      });

      response.send(carro);
})

app.post("/addCarro", async (request, response) => {
      const data = request.body;
      console.log(data);
      await Carro.add(data);

      response.status(201).send({ msg: "Carro adicionado!" });
});

app.put("/carros/:id", async (request, response) => {
      const id = request.params.id;

      await Carro.doc(id).update(request.body);

      response.send({ msg: "Carro editado com sucesso!" })
});

app.delete("/carro/:id", async (request, response) => {
      const { id } = request.params;

      await Carro.doc(id).delete();

      response.send({ msg: "Carro deletado com sucesso!" })
});