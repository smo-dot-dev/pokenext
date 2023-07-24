// Variable to hold request
var request;

//Para la busqueda de pokemones.js
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

//initcap
String.prototype.initCap = function () {
   return this.toLowerCase().replace(/(?:^|\s|-)[a-z]/g, function (m) {
      return m.toUpperCase();
   });
};

$("#poke_button").click(function(event){
  document.getElementById('poke_input').disabled = true;
  document.getElementById('poke_button').disabled = true;
  document.getElementById('selector_normal').innerHTML = "";
  document.getElementById('selector_shiny').innerHTML = "";
  document.getElementById('selector_normal_b').innerHTML = "";
  document.getElementById('selector_shiny_b').innerHTML = "";
  document.getElementById('tipo1').innerHTML = "";
  document.getElementById('tipo2').innerHTML = "";
  document.getElementById('stats_table').innerHTML = "";
  document.getElementById('moves_table').innerHTML = "";
  document.getElementById('abilities_table').innerHTML = "";
  // Prevent default posting of form - put here to work in case of errors
  event.preventDefault();
  // Abort any pending request
  if (request) {
      request.abort();
  }
  //Del poke_input saca el nº de pokemon (en caso de usar .gif en local, ya que el número es el nombre del gif)
  /* var poke_enviado = getKeyByValue(pokemones,document.getElementById('poke_input').value.initCap()); */

  var poke_enviado = document.getElementById('poke_input').value.toLowerCase();

  console.log(document.getElementById('poke_input').value.initCap());
  console.log(poke_enviado);
  // Fire off the request
  request = $.ajax({
    url: "poke.php?=" + poke_enviado,
    type: "post",
    data: {post : poke_enviado}
  });
    // Callback handler that will be called on success
  request.done(function (response, textStatus, jqXHR){
    //document.getElementById("salida").innerHTML = response; 
    try {
      var json_response = JSON.parse(response);
    } catch (error) {
      console.log("Fatal error retrieving el pokemon.");
      return;
    }
    var front, front_shiny, back, back_shiny;
    console.log(json_response);

    /* if (poke_enviado >= 1 && poke_enviado <= 649) {//Lo pillamos de nuestros GIF
      front = "<img src=\"img/sprites/" + poke_enviado +".gif\"></img>";
      front_shiny = "<img src=\"img/sprites/" + poke_enviado +"s.gif\"></img>";
      back = "<img src=\"img/sprites/" + poke_enviado +"b.gif\"></img>";
      back_shiny = "<img src=\"img/sprites/" + poke_enviado +"sb.gif\"></img>";
    } else 

   if (poke_enviado > 0 && poke_enviado <= 802){//Lo pillaríamos de la API
      
    } else {
      console.log("Fatal error retrieving el pokemon.");
      return;
    }   */

    front = "<img src=\"" + json_response.sprites["front_default"] + "\"></img>";
      front_shiny = "<img src=\"" + json_response.sprites["front_shiny"] + "\"></img>";
      if (json_response.sprites["back_default"] == null) {
        back = "";
        back_shiny = "";
      }else{
        back = "<img src=\"" + json_response.sprites["back_default"] + "\"></img>";
        back_shiny = "<img src=\"" + json_response.sprites["back_shiny"] + "\"></img>";
      }

      document.getElementById('selector_normal').innerHTML = front;
      document.getElementById('selector_shiny').innerHTML = front_shiny;
      document.getElementById('selector_normal_b').innerHTML = back;
      document.getElementById('selector_shiny_b').innerHTML = back_shiny;

     if (json_response.types.length == 1) {
      document.getElementById('tipo1').innerHTML = "<p>" + json_response.types[0]["type"]["name"].initCap() + "</p>";
      document.getElementById('tipo1').innerHTML += "<img src=\"img/types/" + json_response.types[0]["type"]["name"] + ".png\"></img>";
     }else{
      document.getElementById('tipo1').innerHTML = "<p>" + json_response.types[0]["type"]["name"].initCap() + "</p>";
      document.getElementById('tipo1').innerHTML += "<img src=\"img/types/" + json_response.types[0]["type"]["name"] + ".png\"></img>";
      document.getElementById('tipo2').innerHTML = "<p>" + json_response.types[1]["type"]["name"].initCap() + "</p>";
      document.getElementById('tipo2').innerHTML += "<img src=\"img/types/" + json_response.types[1]["type"]["name"] + ".png\"></img>";
     }
     //Tabla de stats
     for (var i = 0; i < 5; i++) {
        document.getElementById('stats_table').innerHTML += "<tr><th scope=\"row\">" +  
        json_response.stats[i]["stat"]["name"].initCap() + "</th><td>" + json_response.stats[i]["base_stat"] + "</td><tr></tr>";
     }
     //Tabla de habilidades
     for (var i = 0; i < json_response.abilities.length-1; i++) {
        document.getElementById('abilities_table').innerHTML += "<tr><th scope=\"row\">" +  
        json_response.abilities[i]["ability"]["name"].initCap() + "</th><td><a href=\"https://pokemondb.net/ability/" + json_response.abilities[i]["ability"]["name"].toLowerCase()  + "\">More ability Info</a></td><tr></tr>";
     }

     
     //Tabla de ataques
     for (var i = 0; i < json_response.moves.length-1; i++) {
           document.getElementById('moves_table').innerHTML += "<h2><a href=\"https://pokemondb.net/move/" +json_response.moves[i]["move"]["name"].toLowerCase()  + "\"> " + json_response.moves[i]["move"]["name"].initCap() + "</a></h2><br>";
           document.getElementById('moves_table').innerHTML += "<tr><td><b>Level</b></td><td><b>Game</b></td></tr>";
      //Por cada movimiento hacer una fila
        document.getElementById('moves_table').innerHTML += "<tr>";

        for (var j = 0; j < json_response.moves[i]["version_group_details"].length-1; j++) {//Una celda por cada nivel            
            document.getElementById('moves_table').innerHTML += "<tr><td>" + json_response.moves[i]["version_group_details"][j]["level_learned_at"] +"</td><td>" + json_response.moves[i]["version_group_details"][j]["version_group"]["name"]  +"</td>";
        }
        //document.getElementById('moves_table').innerHTML += "</tr>";
     }

  });

  // Callback handler that will be called on failure
  request.fail(function (jqXHR, textStatus, errorThrown){
      // Log the error to the console
    console.error(
        "Error: " + textStatus, errorThrown
    );
  });
  // Callback handler that will be called regardless
  // if the request failed or succeeded
  request.always(function () {
    document.getElementById('poke_input').disabled = false;
    document.getElementById('poke_button').disabled = false;
  });
});