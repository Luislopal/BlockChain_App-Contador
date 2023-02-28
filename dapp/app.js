//https://cdn.esm.sh/web3@1.8.0
import Web3 from 'https://cdn.esm.sh/v92/web3@1.8.0/es2022/web3.js';

const chainId = "0x539"; // Ganache: es donde he desplegado el contrato

let web3 = null;  // Creare mi propio objeto web3, de la version 1.6.0

let contador = null;  // Instancia desplegada del contrato

const init = async () => {
    console.log("Inicializando..");

    // Comprobar que el navegador soporta Ethereum
    if (typeof window.ethereum === "undefined") {
        alert("Instale MetaMask para usar esta aplicación.");
        return;
    }
    try {
        console.log("Manejar el cambio de red");
        ethereum.on('chainChanged', chainId => {
            // Recargar la pagina
            console.log("Seleccionada otra red.");
            window.location.reload();
        });

        console.log("Configurar cambio de cuenta selecionada");
        ethereum.on('accountsChanged', accounts => {
            // Recargar el UI con la primera cuenta
            console.log("Seleccionada otra cuenta =", accounts[0]);
            document.getElementById('cuenta').innerHTML = accounts[0];
        });

        // Comprobar si MetaMask está conectado a la red deseada:
        const cid = await ethereum.request({method: 'eth_chainId'});
        if (cid !== chainId) {
            alert('Debe conectar MetaMask a Ganache.');
            return;
        }

        // Creo mi instancia de web3
        web3 = new Web3(ethereum);
        console.log("web3 =", web3.version);

        console.log("Inicializando abstracción del contrato Contador.");
        const response = await fetch('contracts/Contador.json');
        const json = await response.json();
        const Contador = TruffleContract(json);

        //Provisionar abstracción Contador con web3
        Contador.setProvider(ethereum);

        console.log("Obtener instancia desplegada del contador.");
        contador = await Contador.deployed();

        console.log("Configurar Vigilancia del evento Tic.");
        contador.Tic((error, event) => {
            if (error) {
                console.log("ERROR en evento Tic:", error);
            } else {
                console.log("Se ha producido un evento Tic:");
                const msg = event.args.msg;
                const out = event.args.out;
                console.log(" * Msg =", msg);
                console.log(" * Out =", out.toNumber());
                document.getElementById('valor').innerHTML = out;
            }
        });

        // ROUTER de eventos
        console.log("Configurando manejadores de eventos.");
        const matchEvent = (ev, sel) => ev.target.matches(sel);
        document.addEventListener('click', ev => {
            if (matchEvent(ev, '#cincr')) handleIncr(ev);
            else if (matchEvent(ev, '#login')) handleLogin(ev);
            else if (matchEvent(ev, '#cset2')) handleSet(ev);
        });

        refreshContador();
        refreshAccount();

    } catch (error) {
        console.log(error.message || error);
        alert('Se ha producido un error inesperado: ' + (error.message || error));
    }
};

const handleSet = async event => {
    console.log("Se ha introducido un nuevo valor de contador");
    event.preventDefault();
    const valor = document.getElementById("cset1").value;

    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        if (!account) {
            alert('No se puede acceder a las cuentas de usuario.');
            return;
        }
        console.log("Cuenta =", account);

        // Ejecutar incr como una transacción desde la cuenta account.
        await contador.set(valor, {from: account, gas: 200000});
        refreshContador();
    } catch (error) {
        console.log(error);
    }
}

const handleLogin = async event => {
    // Hacer login en MetaMask para acceder a las cuentas

    console.log("Se ha hecho Click en el botón de Login.");

    event.preventDefault();

    refreshAccount();
};

const handleIncr = async event => {
    console.log("Se ha hecho Click en el botón de incrementar.");

    event.preventDefault();

    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        if (!account) {
            alert('No se puede acceder a las cuentas de usuario.');
            return;
        }
        console.log("Cuenta =", account);

        // Ejecutar incr como una transacción desde la cuenta account.
        await contador.incr({from: account, gas: 200000});
    } catch (error) {
        console.log(error.message || error);
    }
};

const refreshContador = async () => {
    console.log("Refrescando el valor mostrado del contador.");

    try {
        const valor = await contador.valor();

        console.log("Valor =", valor.toNumber());

        document.getElementById('valor').innerHTML = valor;

    } catch (error) {
        console.log(error.message || error);
    }
};

const refreshAccount = async () => {
    console.log("Refrescando la cuenta mostrada.");

    try {
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});
        const account = accounts[0];

        console.log("Logueado con la cuenta =", account);
        document.getElementById('cuenta').innerHTML = account;

    } catch (error) {
        console.log(error);
    }
};

// Inicialización: Ejecutar cuando se ha terminado de cargar la pagina.
//document.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', init);