var Contador = artifacts.require("./Contador.sol");

contract('Usamos un Contador:', accounts => {

  let contador;

  before(async () => {
    contador = await Contador.deployed();
  });

  //Primera prueba
  it("el valor inicial debe ser 0", () => {
    return contador.valor.call()
    .then(function(value) {
      assert.equal(value.toNumber(), 0, "El valor inicial no es 0.");
    });
  });

  //Prueba anterior pero en vez de con promesas, con async/await
  it("el valor inicial debe ser 0", async () => {
    const value = await contador.valor.call();
    assert.equal(value.toNumber(), 0, "El valor inicial no es 0.");
  });

  //Prueba con promesas
  it("incrementar en uno el contador", () => {

    let c1, c2;

    return contador.valor.call()
    .then(value => {
      c1 = value;
      return contador.incr(); 
    })
    .then(() => contador.valor.call() )
    .then(value => {
      c2 = value;

      const incr = c2.sub(c1);
      assert.equal(incr.toNumber(), 1, "El incremento del valor no es 1.");
    });
  });

  //Prueba con async/await
  it("incrementa en cuatro el contador", async () => {

    let c1 = await contador.valor.call();
    await contador.incr(); 
    await contador.incr(); 
    await contador.incr(); 
    await contador.incr(); 
    let c2 = await contador.valor.call();
 
    const incr = c2.sub(c1);
    assert.equal(incr.toNumber(), 4, "El incremento del valor no es 4.");
  });

  //Prueba método set asigna valor
  it("Asigna un valor con set", async () => {

    let c1 = await contador.valor.call();
    await contador.set(1);
    let c2 = await contador.valor.call();
 
    const set = c2;
    assert.equal(set.toNumber(), 1, "El número fijado no es 1.");
  });

  //Prueba método set produce errores si se sale del rango
  it("Asigna valores fuera de rango", async () => {

    let c1 = await contador.valor.call();
    try{
      await contador.set(-1);
    } catch (error) {
      console.log("No ha podido establecerse un valor fuera de rango");
    }
  });

});