const data = POKEMON.pokemon;
const filterType = document.getElementById("select-type");
const sectionCards = document.getElementById("list");
const selectionToSort = document.getElementById("new-order");
const btnInput = document.getElementById("input-search-btn");
const inputName = document.getElementById("input-search");

//-----------------------------Event Listeners--------------------------------//

//Eventlistener para printar os cards na tela inicial e as caixas select para os filtros
document.addEventListener("DOMContentLoaded", () => {

  //Cria um select para os tipos com lista de tipos criada por getTypes
  displayTypeOptions(app.getTypes(data));
  //FAZER: CRIAR SELECT PARA OVO E CANDY_COUNT

  //printa os cards de todos os pokémons
  printAllPokemons(data);
});

//Eventlistener para o botão Procurar
btnInput.addEventListener("click", function (event) {
  event.preventDefault();
    sectionCards.innerHTML = "";
    printInCards(app.findPokemon(data, inputName.value));
  //};
}, false);

//Eventlistener para o select de ordenação
selectionToSort.addEventListener("change", () => {

  //guarda o valor de <option data="..."> DÁ PRA FAZER DE OUTRA FORMA?
  let targetData = selectionToSort.options[selectionToSort.selectedIndex].getAttribute('data');
  printAllPokemons(app.sortPokemons(data, selectionToSort.value, targetData));
});

//Eventlistener para o select por tipo
filterType.addEventListener("change", () => {
  printFilter(app.filterDataByType(data, filterType.value, "type"));
});

//FAZER: EVENTLISTENER PARA O SELECT POR OVO
//FAZER: EVENTLISTENER PARA O SELECT POR CANDY_COUNT

//FAZER: EVENTLISTENER PARA O ÍCONE HOME
//FAZER: EVENT LISTENER PARA O ÍCONE INFO

//-------------------------------Functions DOM--------------------------------//
//Printa na <section class="cards"> os cards de todos os Pokémons que correspondem
//ao tipo selecionado
function printFilter(filtered) {
  sectionCards.innerHTML = "";
  filtered.forEach(poke => printInCards(poke));
};

//Add na <section id="list"> as infos de cada Pokémon
function printInCards (item) {
  sectionCards.innerHTML += `
    <article class= "cardPokemon">
    <img src="#" id="${item.name}">
    <h5>${item.name}</h5>
    <p>${item.num}<br>
    ${item.type.map(type => `${type}`).join(", ")}</p>
    </article>`
};

// <img src="${item.img}" id="${item.name}">

//Printa na tela inicial os cards de todos os Pokémons
function printAllPokemons (allPokemons){
  sectionCards.innerHTML = "";
  data.forEach(poke => printInCards(poke));
};

//Cria options para o <select id="select-type">
function displayTypeOptions(allTypes) {
  filterType.innerHTML = "";
  filterType.innerHTML = `<option value="none">Filtrar Por Tipo</option>`;
  filterType.innerHTML += allTypes.map(type => `<option value= "${type}"> ${type}</option>`).join("");
};

//FAZER: CRIAR OPTIONS PARA O SELECT POR OVO
//FAZER: CRIAR OPTIONS PARA SELECT POR CANDY_COUNT


//-----------------------Event listener click no Pokémon----------------------//
//Eventlistener para o click na imagem do pokémon
sectionCards.addEventListener( 'click', function( e ) {

  //se o click for na imagem do pokémon
  if (e.target.nodeName == 'IMG') {

    //encontra em data o objeto correspondente ao pokémon clicado
    let poke = findPokemon(data, e.target.id)

    //printa na <main> info do pokémon clicado + gráficos
    printStats(poke);


    //Chart 1...............................................................
    var ctxHeight = document.getElementById('heightChart').getContext('2d');
    var chart = new Chart(ctxHeight, {
        type: 'bar',

        data: {
            labels: Object.keys(getHeightFreq(data)),
            datasets: [{
                label: 'Freq: Altura',
                backgroundColor: '#DD545F',
                data: Object.values(getHeightFreq(data))
            }]
        },
        options: {
          responsive: true,
          mantainAspectRatio: false,
          title: {
            display: true,
            text: "Frequência das Alturas"
          }
        },

        tooltips: {
          mode: "index",
          intersect: true,
        },

        annotation: {
          annotations: [{
            type: "line",
            mode: "vertical",
            //scaleID: "x-axis-0",
            value: app.computeStats(data, "height", " m"),
            //borderColor: #0089CE,
            borderWidth: 3,
            label: {
              enabled: true,
              content: "Média dos Alturas"
            }
          }]
        }
    });

    //Chart 2...............................................................
    var ctxWeight = document.getElementById('weightChart').getContext('2d');
    var chart = new Chart(ctxWeight, {

      type: 'bar',

      data: {
        labels: Object.keys(getWeightFreq(data)),
        datasets: [{
            label: 'Peso',
            backgroundColor: '#DD545F',
            data: Object.values(getWeightFreq(data))
        }]
      },

      options: {
        responsive: true,
        mantainAspectRatio: false,
        title: {
          display: true,
          text: "Frequência dos Pesos"
        }
      },

      tooltips: {
        mode: "index",
        intersect: true,
      },

      annotation: {
        annotations: [{
          type: "line",
          mode: "vertical",
          scaleID: "x-axis-0",
          value: app.computeStats(data, "weight", " kg"),
          //borderColor: #0089CE,
          borderWidth: 3,
          label: {
            enabled: true,
            content: "Média dos Pesos"
          }
        }]
      }

    });

    //Chart 3............................................................
    var ctxSpawn = document.getElementById('rarityChart').getContext('2d');
    var chart = new Chart(ctxSpawn, {

        type: 'line',

        data: {
            labels: getName(data),
            datasets: [{
                label: 'Probabilidade de encontrar Pokémon em %',
                borderColor: '#DD545F',
                data: getSpawnChance(data)
            }]
        },
        //options: {}
    });
  };
}, false);//fecha event listener click img pokémon

//-----------------------Funções para pág. de stats---------------------------//
//printa na <main> info do pokémon clicado + gráficos
function printStats(poke) {
  document.getElementById("main-stats").innerHTML = `
  <div class="main">
  <div class="poke-box">
  <section class= "poke-data" class="main-2">
  <img src="${poke.img}">
  <h4>Id#${poke.id} ${poke.name}</h4> <br>
  <p>Altura: ${poke.height} <br>
  Peso: ${poke.weight} <br>
  Candy: ${showCandy(poke)} ${poke.candy}<br>
  Ovo: ${poke.egg} <br>
  Tipo: ${poke.type.map(type => `${type}`).join(", ")} <br>
  Fraqueza de defesa: ${poke.weaknesses.map(type => `${type}`).join(", ")} <br>
  </p>
  </section>
  <section class= "egg-data" class="main-2">
  <h5>Ovos</h5><br>
  <p>2 KM: ${getEggPokes(data, "2 km")} <br>
  5 KM: ${getEggPokes(data, "5 km")} <br>
  10 KM: ${getEggPokes(data, "10 km")}</p>
  </section>
  </div>
  <section class="main-2">
  <p>Média de Altura: ${app.computeStats(data, "height", " m")}</p>
  <p>Média de Peso: ${app.computeStats(data, "weight", " kg")}</p>
  </section>
  <div class="bars">
  <canvas class="charts" id="heightChart"></canvas>
  <canvas class="charts" id="weightChart"></canvas>
  </div>
  <canvas class="charts" id="rarityChart"></canvas>
  </div>`
};

//função para mostrar o número de candy apenas se hover um número válido
function showCandy(el){
  if(typeof el.candy_count !== "undefined"){
    return el.candy_count;
  } else {
    return "";
  };
};

//FAZER!! PRINTAR AS EVOLUÇÕES DOS POKEMONS CONSIDERANDO QUE ALGUNS POSSUEM
//PREV_EVOLUTION, OUTROS NEXT_EVOLUTION E OUTROS OS DOIS.
// function getEvolutions(dat) {
//   //let evols = [];
//   let evols = dat.map(el => `${el.name}`).join(", ");
//   return evols;
// };
// //console.log(getEvolutions(data[0]))


//printa na caixa de ovos as imagens dos pokes correspondentes
function getEggPokes(data, km){
  let a = data.filter(item => item.egg.includes(km));
  let b = a.map(poke => `<img src="${poke.img}">`).join("");
  return b;
};

//FAZER: PRINTAR OS CANDYS IGUAL OS EGGS
// function getCandyPokes(data){
//   // const candyAll = [];
//   // data.map(poke => candyAll.push(poke.candy_count));
//   // return freq(candyAll);
//   let a = data.filter(item => item.candy_count.includes(25));
//   // let b = a.map(poke => `<img src="${poke.img}">`).join("");
//   // return b;
//   return a;
// };
//console.log(getCandyPokes(data));

////////////////////////////////////////////////////////////////////////////////
function getSpawnChance(data){
  const spwanChanceAll = [];
  const dataSort = data.sort((a,b) => (a.name).localeCompare(b.name));
  dataSort.map(poke => spwanChanceAll.push(poke.spawn_chance));
  return spwanChanceAll;
};
////////////////////////////////////////////////////////////////////////////////

//forma uma array de nomes em ordem alfabética
function getName(data){
  const nameAll = [];
  const dataSort = data.sort((a,b) => (a.name).localeCompare(b.name));
  dataSort.map(poke => nameAll.push(poke.name));
  return nameAll;
};
////////////////////////////////////////////////////////////////////////////////

//Contabiliza o números de vezes que cada item que aparece na array,
//retorna objeto onde as keys são os itens da array e os values é a quantidade
function freq(arr) {
  return arr.reduce((counter, item) => {
    counter[item] = counter.hasOwnProperty(item) ? counter[item] + 1 : 1;
    return counter;
  }, {});
};

//calcula a frequencia das alturas
function getHeightFreq(data){
  const heightAll = [];
  data.map(poke => heightAll.push(poke.height));
  heightAll.sort((a,b) => a.localeCompare(b));
  return freq(heightAll);
};

//calcula a frequencia dos pesos
function getWeightFreq(data){
  const weightAll = [];
  data.map(poke => {
    let num = +(poke.weight).replace(' kg','');
    if (num <= 5) {
      num = "0.1 - 5.0 kg"
    } else if (5 > num || num <= 50){
      num = "5.1 - 50.0 kg"
    } else if (50 > num || num <= 200){
      num = "50.1 - 100 kg"
    } else if (200 > num || num <= 400){
      num = "100.1 - 300.0 kg"
    } else if (400 > num || num <= 999){
      num = "300.1 - 999.0 kg"
    }
    weightAll.push(num);
  });
  weightAll.sort((a,b) => a.localeCompare(b));
  return freq(weightAll);
};
