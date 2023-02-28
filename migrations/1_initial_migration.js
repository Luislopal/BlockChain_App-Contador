var Contador = artifacts.require("Contador");

module.exports = function(deployer) {
  deployer.deploy(Contador);
};
