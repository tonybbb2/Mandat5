function formaterLigne(ligne, { format, valeurs }) {
    let values = format
    for (let i = 0; i < valeurs.length; i++) {
        values = values.replace('%', ligne[valeurs[i]]);
    }

    return values;

}

function templateListe({ groupes, donnees }) {
    let elements = '';
    const title = ["is-size-1","is-size-3","is-size-5"];
    const couleur = ["has-background-primary", "has-background-danger", "has-background-warning", "has-background-info"];
    const entetes = [];
    entetes[groupes.length - 1] = '';
    let idxLigne = 0;
    let idxEnteteAAfficher;
    while (idxLigne < donnees.length) {
        // Construit les entêtes au besoin
        idxEnteteAAfficher = groupes.length - 1;//detail
        for (let i = groupes.length - 2; i >= 0; i -= 1) {
            const nouvelleEntete = formaterLigne(donnees[idxLigne], groupes[i]);
            if (nouvelleEntete !== entetes[i]) {
                idxEnteteAAfficher = i;
                entetes[i] = nouvelleEntete;
            }
        }
        for (let i = idxEnteteAAfficher; i < groupes.length - 1; i += 1) {
            // Affiche l'entête actualisée
            elements += `<h${i + 1} class="is-size-${i+2}"><ul class=${couleur[i]}>${entetes[i]}</ul></h${i + 1}>`;
        }

        // Affiche le détail
        const detail = formaterLigne(donnees[idxLigne], groupes[groupes.length - 1]);

        elements += `<p class=${title[7]}><div class=${couleur[3]}>${detail}</div></p>`;
        idxLigne += 1;
    }
    

    const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
        <link rel='stylesheet' href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.3/css/bulma.min.css">
          <meta charset="UTF-8">
          <title>Mandat 4</title>
      </head>
      <style>
        ul{
            margin-bottom : 7px;
        }
      
        div{
            margin-bottom : 7px;
        }
      </style>
        <body>
          ${elements}
        </body>
        </html>`;

    return html;
}


exports.templateListe = templateListe;