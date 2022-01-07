import { saveAs } from "../d3/FileSaver.js";
import "../d3/Blob.js";
import InteractiVenn from "../javascript.js";

export function Export() {

  const element = React.createElement;
  
  const title = element(
    'p', 
    {style: {fontFamily: 'Sans-serif', fontSize: '12px'}}, 
    "Export current diagram:"
  );
    
  const svgOption = element('option', { value: '.svg', readOnly: true, defaultValue: '.svg' }, '.svg');
  const pngOption = element('option', { value: '.png', readOnly: true, defaultValue: '.png'  }, '.txt');
  const txtOption = element('option', { value: '.png', readOnly: true, defaultValue: '.txt'  }, '.txt');

  const select = element(
    'select', 
    { id: 'figureformat', name: 'format', form: 'format', style: { fontSize: '12px' }},
    svgOption,
    pngOption,
    txtOption,
  );

  const inputProps = {
    type: 'text', 
    style: {fontFamily: 'Sans-serif', fontSize: '12px'}, 
    className: "filename", 
    id: "svg-name", 
    size: "23", 
    placeholder: "Write file name here",
  }
  const input = element(
    'input',
    inputProps
  )

  const label = element(
    'label',
    { style: { fontFamily: 'Sans-serif', fontSize: '11px'}},
    input,
    select
  )

  const getPictureButton = element(
    'button',
    { id: 'getPicture', style: {fontFamily: 'Sans-serif', fontSize: '12px'}, value: 'Save', type: 'button', onClick: getPicture },
    'Export',
  )

  const prompt = element(
    'p',
    { style: {fontFamily: 'Sans-serif', fontSize: '11px' }},
    'Try opening the ',
    element('strong', null, '.svg'),
    'diagram using',
    element(
      'a', 
      {href: 'https://inkscape.org/release/', target: '_blank', rel: 'noreferrer' },
      'Inkscape'
    ),
    'to move shapes, resize, change font, colors and more.'
  )

  return (
    element(
      'form', 
      { id: 'svg-options', style: { textAlign: 'center', paddingBottom: '15px' }},
      title,
      label,
      getPictureButton,
      prompt
    )
  )
}



/**
 * @description Prepare the diagram to be download and starts the download call of user's browser. The function get the file name and the file type (txt, svg or png) through the GUI. If .txt is selected, the function exports a text file separating elements by each intersection.
 */
 function getPicture() {

  const { getBrowserName } = InteractiVenn;
  var bname = getBrowserName();
  if( bname == "Safari"){
      alert("You are using Safari and it does not support Blob type. Exporting the diagram probably will not work. Please consider to use the Chrome or Firefox web browsers.");
  }

  var serializer = new XMLSerializer();
  var svg = document.getElementById("diagram");

//    d3.select("diagram").attr("width", x).attr("height", y);

  var chooser = document.getElementById("figureformat");
  var choosen_type = chooser.options[chooser.selectedIndex].value;
  var serialized = serializer.serializeToString(svg);
  var new_blob = new Blob([serialized], {type: "image/svg+xml;charset=" + document.characterSet});
  var document_name = document.getElementById("svg-name").value + choosen_type;
  if (choosen_type == ".svg") {
      //alert("Saving diagram as "+document_name+". It may take some seconds.");
      saveAs(new_blob, document_name);
      return false;
  } else {
      if (choosen_type == ".png") {

          var image = new Image();
          image.src = 'data:image/svg+xml;base64,' + window.btoa(serialized);
          image.onload = function () {
              var scale = 2;
              var canvas = document.createElement('canvas');
              canvas.width = image.width * scale;
              canvas.height = image.height * scale;

              var context = canvas.getContext('2d');
              context.scale(scale, scale);
              context.drawImage(image, 0, 0);
              // set to draw behind current content
              context.globalCompositeOperation = "destination-over";

              // set background color
              context.fillStyle = '#FFFFFF'; // <- background color

              // draw background / rect on entire canvas
              context.fillRect(0, 0, canvas.width, canvas.height);

              var a = document.createElement('a');
              a.download = document_name;
              a.href = canvas.toDataURL('image/png');
              document.body.appendChild(a);
              a.click();
          }
          return false;
      } else {
          var file = "";
          if (choosen_type == '.txt') { //exports the list of intersections' elements instead of a diagram
              for (var i = 0; i < labelsDiagram.length; i++) {
                  var id = labelsDiagram[i].toUpperCase();
                  var set = intersectionsSet[id];

                  if (set != null) {
                      var textName = "[";
                      textName = textName + document.getElementById("name" + id[0]).value;
                      for (var j = 1; j < id.length; j++) {
                          textName = textName + "] and [" + document.getElementById("name" + id[j]).value;
                      }
                      textName = textName + "]";

                      file = file + textName + ": ";
                      file = file + set.toString();
                      file = file + "\n";
                  }

              }
              saveAs(new Blob([file], {type: "text/plain;charset=" + document.characterSet}), document_name);
              return false;
          }
      }
  }
}
