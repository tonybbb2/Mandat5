function formaterLigne(ligne, { format, valeurs }) {
  let values = format
  for (let i = 0; i < valeurs.length; i++) {
    values = values.replace('%', ligne[valeurs[i]]);
  }

  return values;
}
function templateTableau({ titre, colonnes, donnees }) {
  let idxLigne = 0;
  let elements = '<h1 class = "title is-1">' + formaterLigne(donnees[0], titre) + '</h1>';

  while (idxLigne < donnees.length) {
    elements += '<div class="columns">';

    for (let idxCol = 1; idxCol <= colonnes.nb; idxCol += 1) {
      elements += '<div class="column is-2">';

      //Saute de ligne
      if (idxLigne < donnees.length && donnees[idxLigne][colonnes.saut] === idxCol) {
        
        elements += '<p class="has-background-secondary p-1">';
        elements +='<ul class= "box has-background-primary">' + formaterLigne(donnees[idxLigne], colonnes.contenu)+ '</ul></p>';
        idxLigne += 1;
      }
      elements += '</div>';
    }

    elements += '</div>';
  }

  const html = `<!DOCTYPE html>
                    <html lang="en">
                    <head>

                      <meta charset="UTF-8">

                      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css">

                      <title> Mandat 4 </title>

                    </head>
                    <body>
                      ${elements}
                    </body>
                    
                    </html>`;
    return html;
}


exports.templateTableau = templateTableau;
