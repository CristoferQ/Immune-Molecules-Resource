//Creación del slider de los largos. En un principio se encuentra vacío.
var slider = $("#ex2").slider({
  range: true,
  step: 1,
  value: [0,10]
});
//Estilos del slider. 
$(".tooltip-inner").css("display", "none");
$(".slider-selection").css("background","#0378B3");
$(".slider-track-low").css("background", "grey");
$(".slider-track-high").css("background", "grey");
$(".slider").css("width", "90%");
//Creación de los select, vacíos de momento.
var pfam_select = $("#pfam_input").select2();
var cc_select = $("#cc_input").select2();
var mf_select = $("#mf_input").select2();
var bp_select = $("#bp_input").select2();
var pdb_select = $("#pdb_input").select2();
var chain_select = $("#chain_input").select2();
$("#results").hide()
var results_table = $("#results-table").DataTable({
  "autoWidth": false,
  "columns": [
    {"data": "id_sequence", "width": "30%"},
    {"data": "Length", "width": "5%"},
    {
      "data": "GO_Celular_Component",
      "defaultContent": "",
      "width": "15%"
    },
    {
      "data": "GO_Molecular_Function",
      "defaultContent": "",
      "width": "15%"
    },
    {
      "data": "GO_Biological_Process",
      "defaultContent": "",
      "width": "15%"
    },
    {
      "data": "Type",
      "defaultContent": "",
      "width": "5%"
    },
    {
      "data": null,
      "defaultContent": `<button class='details w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type = 'button'>
      <i class='fas fa-eye'></i></button>`,
      "width": "5%"
    }
  ],
})
//Función que actualiza el slider y el small. 
function updateLengths(min, max){
  slider.slider("setAttribute", "min", min);
  slider.slider("setAttribute", "max", max);
  slider.slider("setAttribute", "value", [min, max]);
  slider.slider("refresh");
  $(".slider").css("width", "90%");
  $("#ex2SliderVal1").text(min)
  $("#ex2SliderVal2").text(max)
}
//Cuando se generen cambios en el slider, se actualizan los valores del small.
$("#ex2").on("change", function (slideEvt) {
  $("#ex2SliderVal1").text(slideEvt.value.newValue[0]);
  $("#ex2SliderVal2").text(slideEvt.value.newValue[1]);
});
//Muestra lo que tiene que mostrar en antibodies. 
function renderAntibodies(){
  $("#div_largo").show();
  $("#div_pfam").show();
  $("#div_bgo").show();
  $("#div_mgo").show();
  $("#div_cgo").show();
  $("#div_estructura").show();
  $("#div_cadena").show();
}
//Muestra lo que tiene que mostrar en antigens. 
function renderAntigens(){
  $("#div_largo").show();
  $("#div_pfam").show();
  $("#div_bgo").show();
  $("#div_mgo").show();
  $("#div_cgo").show();
  $("#div_estructura").show();
  $("#div_epitope").show();
}
//Muestra lo que tiene que mostrar en epitopes.
function renderEpitopes(){
  $("#div_largo").show();
  $("#div_tipo").show();
  $("#div_epitope_antigeno").show();
}
//Rellena los selects con la información correspondiente
function fillSelects(selected){
  $.ajax({
    url: "http://localhost:5001/getGO/",
    method: 'POST',
    data: {
      "type": selected
    }
  }).done( function(data) {
    //Se llama a la función que rellena el slider
    min = data.minLength
    max = data.maxLength
    updateLengths(min, max)
    //Obtener los arrays
    pfam = data.Pfam
    cellular_component = data.Cellular_component
    molecular_function = data.Molecular_function
    biological_process = data.Biological_process
    pdb = data.pdb
    cadenas = ["", "Heavy", "Light"]
    //Genera unos placeholders de mentira
    pfam.unshift("")
    cellular_component.unshift("")
    molecular_function.unshift("")
    biological_process.unshift("")
    pdb.unshift("")
    //Rellena los select
    pfam_select.empty().select2({
      data: pfam
    });
    cc_select.empty().select2({
      data: cellular_component
    });  
    mf_select.empty().select2({
      data: molecular_function
    });
    bp_select.empty().select2({
      data: biological_process
    });
    pdb_select.empty().select2({
      data: pdb
    });
    chain_select.empty().select2({
      data: cadenas
    });
  })
}
//Cambios en las opciones dependiendo de la bd. 
var selected;
$("#typeOfDatabase").on("change", function () {
    //Esconde todo
    $("#info").remove();
    $("#div_largo").hide();
    $("#div_pfam").hide();
    $("#div_bgo").hide();
    $("#div_mgo").hide();
    $("#div_cgo").hide();
    $("#div_estructura").hide();
    $("#div_pdb").hide();
    $("#div_cadena").hide();
    $("#div_epitope").hide();
    $("#div_tipo").hide();
    $("#div_epitope_antigeno").hide();
    $("#checkbox_structure").prop( "checked", false );
    selected = $("#typeOfDatabase option:selected").text()
    //Rellena con la info correspondiente
    if (selected == 'Antibody') {
      renderAntibodies();
      fillSelects(selected)
    }
    else if (selected == 'Antigen') {
      renderAntigens();
      fillSelects(selected);
    }
    else if (selected == 'Epitope') {
      renderEpitopes();
    }
});
//Detecta el checkbuton de has structure y muestra el formulario del pdb.
$("#checkbox_structure").on("click", function(){
  value = $(this).is(":checked");
  if(value){
    $("#div_pdb").show()
  }
  else{
    $("#div_pdb").hide()
  }
  $(".select2").css("width", "100%");
})

//Va a buscar la data solicitada
$("#submit").on("click", function(){
  $(".loader").show()
  $("#results").hide();
  $.ajax({
    url: "http://localhost:5001/getSearch",
      method: "POST",
      data: { 
        type: $("#typeOfDatabase option:selected").text(),
        min: $("#ex2SliderVal1").text(),
        max: $("#ex2SliderVal2").text(),
        pfam : $("#pfam_input").select2("data")[0].text,
        go_cc: $("#cc_input").select2("data")[0].text,
        go_mf: $("#mf_input").select2("data")[0].text,
        go_bp: $("#bp_input").select2("data")[0].text,
        pdb: $("#pdb_input").select2("data")[0].text,
        chain: $("#chain_input").select2("data")[0].text,
        has_pdb: $("#checkbox_structure").is(":checked"),
        pdb_id: $("#pdb_input").select2("data")[0].text,
        has_epitope: $("#checkbox_epitope").is(":checked"),
      }
  }).done(function(data){
      $(".loader").hide();
      $("#results").show();
      selected = $("#typeOfDatabase option:selected").text();
      results_table.clear()
      results_table.rows.add(data).draw()
      let chain = results_table.column(5);
      if(selected == "Antigen"){chain.visible(false)}
      if(selected == "Antibody"){chain.visible(true)}
  })
})

$('#results-table tbody').on( 'click', 'button', function () {
  let selected = $("#typeOfDatabase option:selected").text();
  let id = $(this).parents('tr').children().html()
  route = "/profile/" + selected + "/" + id;
  console.log(route)
  window.open(route, "_blank")
} );