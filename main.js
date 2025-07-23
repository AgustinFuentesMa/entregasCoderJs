alert("Bienvenido a la primera entrega del curso de javascript")


//FUNCIONES CON PARAMETROS, (le haría más del minimo pero hoy me voy a verlo a atletico tucumán!) 

//Funcion para saludarr
function saludar(nombre) {
  console.log("Hola, " + nombre + "!");
}

saludar("Agustín");



//Funcion para sumar 2 numeros 
let numero1=parseInt(prompt("Ingrese el primer numero de la suma: "))
let numero2=parseInt(prompt("Ingrese el segundo numero de la suma: "))
function sumar(a, b) {
  let resultado = (a+b);
  console.log("La suma es:",resultado)
}
sumar(numero1,numero2)



// Funcion para saber si una persona es mayor de edad (con condicional)
function esMayorDeEdad(nombre, edad) {
  if (edad >= 18) {
    console.log(nombre + " es mayor de edad.");
  } else {
    console.log(nombre + " es menor de edad.");
  }
}

esMayorDeEdad("Lucía", 20);
esMayorDeEdad("Tomás", 15);



//Ciclo for

let tabla=prompt("Hola! Que tabla deseas saber hoy?")

for(i=1;i<=10;i++)
{
   console.log(tabla+"x"+i+"="+(tabla*i))
}


//Condicional

function esPar(numero) {
  if (numero % 2 === 0) {
    console.log(numero + " es un número par.");
  } else {
    console.log(numero + " es un número impar.");
  }
}

esPar(4);
esPar(7); 


//Array de jugadores de River

const jugadoresRiver= ["Montiel", "Salas", "Borja", "Lanzini", "Armani"]

console.log(jugadoresRiver)

//PUSH
jugadoresRiver.push("Colidio")
console.log(jugadoresRiver)

//POP
jugadoresRiver.pop()
console.log(jugadoresRiver)