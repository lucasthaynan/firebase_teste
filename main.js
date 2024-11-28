// Importação dos módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Configuração do Firebase usando variáveis de ambiente
// main.js
const firebaseConfig = {
    apiKey: "API_KEY_PLACEHOLDER",
    authDomain: "AUTH_DOMAIN_PLACEHOLDER",
    projectId: "PROJECT_ID_PLACEHOLDER",
    storageBucket: "STORAGE_BUCKET_PLACEHOLDER",
    messagingSenderId: "MESSAGING_SENDER_ID_PLACEHOLDER",
    appId: "APP_ID_PLACEHOLDER",
    measurementId: "MEASUREMENT_ID_PLACEHOLDER",
    databaseURL: "DATABASE_URL_PLACEHOLDER"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


// Função para carregar e mostrar o último produto inserido
function loadLastProduct() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";  // Limpa a lista antes de adicionar um novo produto

    // Recupera os produtos do Firebase
    const productsRef = ref(database, "produtos");

    // Escutando em tempo real as mudanças no Firebase
    onValue(productsRef, (snapshot) => {
        if (snapshot.exists()) {
            const products = snapshot.val();
            const productIds = Object.keys(products);  // Pega todas as chaves (IDs)
            const lastProductId = productIds[productIds.length - 1];  // ID do último produto
            const lastProduct = products[lastProductId];  // Acessa o último produto

            // Cria um novo item de lista para o último produto
            const li = document.createElement("li");
            li.textContent = `${lastProduct.nome} - R$ ${lastProduct.valor}`;
            productList.appendChild(li);
        } else {
            productList.innerHTML = "<li>Não há produtos cadastrados.</li>";
        }
    });
}

// Função para adicionar um produto
function addProduct(event) {
    event.preventDefault();

    const id = document.getElementById("product-id").value;
    const name = document.getElementById("product-name").value;
    const value = document.getElementById("product-value").value;

    if (!id || !name || !value) {
        alert("Preencha todos os campos!");
        return;
    }

    // Enviando os dados para o Firebase
    set(ref(database, "produtos/" + id), {
        id: id,
        nome: name,
        valor: value
    }).then(() => {
        alert("Produto adicionado com sucesso!");
        document.getElementById("add-product-form").reset();  // Limpa o formulário
    }).catch((error) => {
        console.error("Erro ao adicionar produto: ", error);
    });
}

// Inicializar a página
window.onload = function() {
    loadLastProduct(); // Carregar o último produto ao carregar a página
    document.getElementById("add-product-form").addEventListener("submit", addProduct);
};
