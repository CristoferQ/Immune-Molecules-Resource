//Objeto de prueba
var epitopes = [{ name: "Krist Novoselic", chain: "A", res: [13, 14, 15, 16, 17], color: '#276cb8', drawing: "cartoon", visible: false},
                { name: "Dave Grohl", chain: "B", res: [1, 2, 3, 4], color: '#276cb8', drawing: "cartoon", visible: false},
                { name: "Kurt Cobain", chain: "C", res: [3, 4, 5, 6, 7], color: '#276cb8', drawing: "cartoon", visible: false}]
//Panel de visualización de epítopes.
for (let i = 0; i < epitopes.length; i++) {
  let visible = epitopes[i].visible;
  var vis;
  if(visible){
    vis = "visible"
  }
  else{
    vis = "no-visible"
  }
  let pad = `
  <li class = "panel_item" id = "` + visible+`">
    <div class = "reglon">
      <span class="selector name" id="region` + i.toString() + `">` + epitopes[i].name + `</span> 
      <button class="go rounded bg-blue-500 hover:bg-blue-700 py-1 px-1 text-white" id="`+"go_"+ i.toString()+`">Go to</button>
    </div>
    <hr>
    <div class = "reglon">
      <label for="drawing">Drawing Method</label>
      <select class = "selector drawing" name="drawing" id="drawing_` + i.toString() + `">
      <option value="cartoon">Cartoon</option>
        <option value="line">Line</option>
        <option value="cross">Cross</option>
        <option value="stick">Sticks</option>
        <option value="sphere">Sphere</option>
      </select>
    </div>
    <hr>
    <div class = "reglon">
      <label for="color-picker">Color</label>
      <input class="selector color-picker" id = "color-picker_`+ i.toString() + `" value='#276cb8'/>
    </div>
    <hr>
    <div class = "reglon">
      <div class="pretty p-icon p-toggle p-plain" style="float: right;">
        <input type="checkbox" class="checkbox" id="checkbox_`+ i.toString() + `"/>
        <div class="state p-success-o p-on" style="color: black;">
          <i class="fas fa-eye"></i>
        </div>
        <div class="state p-off" style="color: grey;">
          <i class="fas fa-eye-slash"></i>
        </div>
      </div>
      <div class = "clear"></div>
    </div>
  </li>`
  $("#listado").append(pad);
}
//Función que renderiza la estructura que la página solicita.
function render_structure(){
  jQuery.ajax(pdbUri, {
    success: function (data) {
      let v = viewer;
      v.addModel(data, "pdb");
      v.setStyle({}, { cartoon: { colorscheme: 'chain' } });
      v.zoomTo();
      v.render();
      v.zoom(1.2, 2000);
    },
    error: function (hdr, status, err) {
      console.error("Failed to load PDB " + pdbUri + ": " + err);
    }
  });
}
var element = $('#molecule');
var structName = $("h3").text();
var config = { backgroundColor: 'black' };//#83C576
var viewer = $3Dmol.createViewer(element, config);
var pdbUri = '../Structures/' + structName + '.pdb';
render_structure()
//Crea un selector de colores.
$('.color-picker').spectrum({
  type: "color",
  showPalette: false,
  showInitial: true,
  showAlpha: false,
  showButtons: true,
  allowEmpty: false,
});
//Función que obtiene la secuencia y la marca con los epitoles. ¿
function generateText(){
  jQuery.ajax({
    url: "http://localhost:5001/getSequence/" + structName
  }).done(function (data) {
    let text = `<ul style= "background-color: black; color: gray; padding: 20px">`
    for (let i = 0; i < data.length; i++) {
      line = ""
      cadenas = epitopes.map(x => x.chain)
      if (cadenas.includes(data[i].chain)) {
        for (let j = 0; j < cadenas.length; j++) {
          if (cadenas[j] == data[i].chain) {
            positions = epitopes[j].res.map(x => x - 1)
            for (let k = 0; k < data[i].sequence.length; k++) {
              if (positions.includes(k)) {
                console.log(epitopes[j].color)
                line += `<span style="color:`+ epitopes[j].color +`;">` + data[i].sequence[k] + "</span>"
              }
              else {
                line += data[i].sequence[k]
              }
            }
          }
        }
      }
      else {
        line += data[i].sequence
      }
      text += `<li>
      <p style= "text-align: left; font-family: 'Courier New', monospace; max-width: 60ch; fontsize: 7px">>Chain ` + data[i].chain + `</p>
      <p style= "text-align: left; font-family: 'Courier New', monospace; max-width: 60ch; fontsize: 7px">`+ line + `</p>
      </li>`
    }
    Swal.fire({
      title: "Sequences",
      html: text,
      width: 750,
      showConfirmButton: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })
  })
}
$("#view").on("click", function () {
  generateText();
})
//Dado el click en algún "Go to", realiza un zoom hasta el elemento.
$(".go").on("click", function(){
  let number = parseInt($(this).prop("id").replace("go_", ""));
  let chain = epitopes[number].chain;
  let residues = epitopes[number].res;
  viewer.zoomTo(sel = {chain: chain, resi: residues}, animationDuration = 1000, fixedPath=true)
})
//Actualización de epitopes aplicando los cambios en los color-picker. 
$(".color-picker").spectrum({
  type: "color",
  showPalette: false,
  showInitial: true,
  showAlpha: false,
  showButtons: true,
  allowEmpty: false,
  chooseText: "OK!",
  clickoutFiresChange: false,
  change: function(new_color) {
    let i = parseInt($(this).attr("id".replace("color-picker_", "")).replace("color-picker_",""));
    epitopes[i].color = new_color.toHexString();
    update_view(i)
  }
})
//Actualización aplicando los cambios en los select.
$(".drawing").on("change", function(){
  let i = parseInt($(this).attr("id").replace("drawing_",""));
  let value = $(this).val();
  epitopes[i].drawing = value;
  update_view(i)
})
//Actualización visiblidad o invisibilidad del epitope.
$(".checkbox").on("click", function(){
  let i = parseInt($(this).attr("id").replace("checkbox_",""));
  let value = $(this).is(":checked");
  epitopes[i].visible = value;
  if(value == true){
    update_view(i)
  }
  else{
    viewer.setStyle({chain: epitopes[i].chain, resi: epitopes[i].res}, { cartoon: { colorscheme: 'chain' } });
    viewer.render()
  }

})
//Renderizar epitopes con las opciones configuradas.
function update_view(i){
  let drawing = epitopes[i].drawing;
  let visible = epitopes[i].visible;
  console.log(visible)
  if(visible){
    if(drawing == "line"){
      viewer.setStyle(sel = {chain: epitopes[i].chain, resi: epitopes[i].res}, { line: { color: epitopes[i].color }})
      viewer.addStyle({chain: epitopes[i].chain, resi: epitopes[i].res}, { cartoon: { colorscheme: 'chain' } })
    }
    if(drawing == "cross"){
      viewer.setStyle(sel = {chain: epitopes[i].chain, resi: epitopes[i].res}, { cross: { color: epitopes[i].color }})
      viewer.addStyle({chain: epitopes[i].chain, resi: epitopes[i].res}, { cartoon: { colorscheme: 'chain' } })
    }
    if(drawing == "stick"){
      viewer.setStyle(sel = {chain: epitopes[i].chain, resi: epitopes[i].res}, { stick: { color: epitopes[i].color }})
      viewer.addStyle({chain: epitopes[i].chain, resi: epitopes[i].res}, { cartoon: { colorscheme: 'chain' } })
    }
    if(drawing == "sphere"){
      viewer.setStyle(sel = {chain: epitopes[i].chain, resi: epitopes[i].res}, { sphere: { color: epitopes[i].color }})
      viewer.addStyle({chain: epitopes[i].chain, resi: epitopes[i].res}, { cartoon: { colorscheme: 'chain' } })
    }
    if(drawing == "cartoon"){
      viewer.setStyle(sel = {chain: epitopes[i].chain, resi: epitopes[i].res}, { cartoon: { color: epitopes[i].color }})
    }
    viewer.render()
  }
}