const express = require("express");
const list = require("./templatesListe")

const templateTableau = require('./templatesTableaux')

const knex = require("knex")({
	client: "mssql",
	connection: {
		host: "sv55.cmaisonneuve.qc.ca",
		user: "3D1",
		password: "Projet3689",
		database: "college",
		options: {
			enableArithAbort: false,
		},
	},
	pool: { min: 0, max: 7 },
});

const app = express();

/* 1 - Compétences du programme 420 */

async function competencesDunProgramme(idProgramme) {
	const resultat = {  
	donnees: [],
	groupes: [],
	pied: []
  };  

	resultat.donnees = await knex('competences')
		.select('idProgramme', 'code', 'enonce')
		.where('idProgramme', '=', idProgramme)
		.orderBy('code');

	resultat.groupes.push({ format: 'Compétences du programme %', valeurs: ['idProgramme'] });
	resultat.groupes.push({ format: '% %', valeurs: ['code', 'enonce'] });
	resultat.pied.push({format : 'Detail %', valeurs: ['code']
	})
	return resultat;
}


app.get('/competencesDunProgramme', async (req, rep) => {
	try {
		const idProgramme = Number(req.query.id);
		const modele = await competencesDunProgramme(idProgramme);
		rep.send(list.templateListe(modele));
		return null;
	} catch (err) {
		console.log(err);
		return null;
	}
});

/* 2 - Compétences et éléments du programme 4	20 */

async function competencesElementsDunProgramme(idProgramme) {
	const resultat = {
		donnees: [],
		groupes: [],
	};

	resultat.donnees = await knex('ElementCompetences')
		.join('Competences', 'Competences.id', '=', 'ElementCompetences.idCompetence')
		.select('idProgramme', 'Code', 'Enonce', 'No', 'Element')
		.where('idProgramme', '=', idProgramme)
		.orderBy('Code');

	resultat.groupes.push({ format: 'Compétences et éléments du programme %', valeurs: ['idProgramme'] });
	resultat.groupes.push({ format: '% %', valeurs: ['Code', 'Enonce'] });
	resultat.groupes.push({ format: '% %', valeurs: ['No', 'Element'] });
	return resultat;
}


app.get('/competencesElementsDunProgramme', async (req, rep) => {
	try {
		const idProgramme = Number(req.query.id);
		const modele = await competencesElementsDunProgramme(idProgramme);
		rep.send(list.templateListe(modele));
		return null;
	} catch (err) {
		console.log(err);
		return null;
	}
});

/* 3 - Cours et compétences du profil Infrastructure réseaux */
//Session ne marche pas
async function competencesDunProfil(idProfil) {
	const resultat = {
		donnees: [],
		groupes: [],
	};

	resultat.donnees = await knex("Cours")

		.join("coursprofils", "CoursProfils.idcours", "Cours.id")
		.join("CompetenceCours", "Cours.id", "CompetenceCours.idCours")
		.join("Competences", "Competences.id", "CompetenceCours.idCompetence")
		.join("Profils", "Profils.id", "CoursProfils.idprofil")
		.select("Nom", "Session", "Sigle", "Titre", "Heurestotales", "Code", "Enonce")
		.where("Profils.id", "=", idProfil)
		.orderBy("Session")
		.orderBy("Sigle")
		.orderBy("Code");

	resultat.groupes.push({ format: 'Cours et compétences du profil %', valeurs: ['Nom'] });
	resultat.groupes.push({ format: 'Session %', valeurs: ['Session'] });
	resultat.groupes.push({ format: '% % % heures', valeurs: ['Sigle', 'Titre', 'Heurestotales'] });
	resultat.groupes.push({ format: '% %', valeurs: ['Code', 'Enonce'] });
	return resultat;
}


app.get('/competencesDunProfil', async (req, rep) => {
	try {
		const idProfil = Number(req.query.id);
		const modele = await competencesDunProfil(idProfil);
		rep.send(list.templateListe(modele));
		return null;
	} catch (err) {
		console.log(err);
		return null;
	}
});

/* 4 - Compétences et cours du profil Développement d'application */
//Return True pour obligatoire ????
async function competencesDunProfil2(idProfil) {
	const resultat = {
		donnees: [],
		groupes: [],
	};

	resultat.donnees = await knex('ProfilsCompetences')
		.join('Profils', 'Profils.Id', '=', 'ProfilsCompetences.IdProfil')
		.join('Competences', 'Competences.Id', 'ProfilsCompetences.IdCompetence')
		.join('CompetenceCours', 'CompetenceCours.IdCompetence', 'Competences.Id')
		.join('Cours', 'Cours.Id', 'CompetenceCours.IdCours')
		.select('Nom', 'idProfil', 'Code', 'Enonce', 'Sigle', 'Titre', 'Obligatoire')
		.where('idProfil', '=', idProfil)
		.orderBy('Code');

	resultat.groupes.push({ format: "Compétences et cours du profil %", valeurs: ['Nom'] });
	resultat.groupes.push({ format: '% %', valeurs: ['Code', 'Enonce'] });
	resultat.groupes.push({ format: '% % %', valeurs: ['Sigle', 'Titre', 'Obligatoire'] });
	return resultat;
}


app.get('/competencesDunProfil2', async (req, rep) => {
	try {
		const idProfil = Number(req.query.id);
		const modele = await competencesDunProfil2(idProfil);
		rep.send(list.templateListe(modele));
		return null;
	} catch (err) {
		console.log(err);
		return null;
	}
});
/* 5 - Description des cours du profil Développement d'application */
async function competencesDunProfil3(idProfil) {
	const resultat = {
		donnees: [],
		groupes: [],
	};

	resultat.donnees = await knex('Profils')
		.join('CoursProfils', 'CoursProfils.IdProfil', '=', 'Profils.Id')
		.join('Cours', 'Cours.Id', 'CoursProfils.IdCours')
		.select('Profils.Id', 'Session', 'Sigle', 'Nom', 'Cours.Description', 'HeuresTheoriques', 'HeuresPratiques', 'HeuresPersonnelles')
		.where('Profils.Id', '=', idProfil)
		.orderBy('Session', 'ASC')
		.groupBy('Profils.Id', 'Profils.Nom', 'Session', 'Sigle', 'Cours.Description', 'HeuresTheoriques', 'HeuresPratiques', 'HeuresPersonnelles');


	resultat.groupes.push({ format: "Description des cours du profil %", valeurs: ['Nom'] });
	resultat.groupes.push({ format: 'Session %', valeurs: ['Session'] });
	resultat.groupes.push({ format: '% % %-%-%', valeurs: ['Sigle', 'Nom', 'HeuresTheoriques', 'HeuresPratiques', 'HeuresPersonnelles'] });
	resultat.groupes.push({ format: '%', valeurs: ['Description'] });
	return resultat;
}


app.get('/competencesDunProfil3', async (req, rep) => {
	try {
		const idProfil = Number(req.query.id);
		const modele = await competencesDunProfil3(idProfil);
		rep.send(list.templateListe(modele));
		return null;
	} catch (err) {
		console.log(err);
		return null;
	}
});

/* 6 - Charge de travail du programme 420 */
async function chargedetravail(idProgramme) {
	const resultat = {
		donnees: [],
		groupes: [],
	};

	resultat.donnees = await knex('Profils')
		.join('Programmes', 'Programmes.Id', '=', 'Profils.IdProgramme')
		.join('CoursProfils', 'Profils.Id', '=', 'CoursProfils.IdProfil')
		.join('Cours', 'Cours.Id', '=', 'CoursProfils.IdCours')
		.select('Profils.Nom', 'CoursProfils.Session')
		.sum('Cours.HeuresTheoriques AS HT')
		.sum('Cours.HeuresPratiques AS HPRAT')
		.sum('Cours.HeuresPersonnelles AS HPERS')
		.groupBy('Profils.Nom', 'Session')
		.where('Programmes.Id', '=', idProgramme)
		.orderBy('Profils.Nom', 'CoursProfils.Session');


	resultat.groupes.push({ format: "Charge de travail du programme", valeurs: [idProgramme] });
	resultat.groupes.push({ format: '%', valeurs: ['Nom'] });
	resultat.groupes.push({ format: 'Session %, théorie: %, pratique: %,personnel: %', valeurs: ['Session', 'HT', 'HPRAT', 'HPERS'] });
	return resultat;
}


app.get('/chargedetravail', async (req, rep) => {
	try {
		const idProgramme = Number(req.query.id);
		const modele = await chargedetravail(idProgramme);
		rep.send(list.templateListe(modele));
		return null;
	} catch (err) {
		console.log(err);
		return null;
	}
});

/*requetes avec tableaux. */

async function grilleCoursDeProfil(idProfil) {
	const resultat = {
		donnees: [], // les données
		titre: {
			format: 'Grille de cours du profil %',
			valeurs: ['nom']
		},
		colonnes: {
			nb: 6,
			saut: 'session',
			contenu: {
				format: '% %',
				valeurs: ['sigle', 'titre']
			},
		},
	};
	resultat.donnees = await knex('profils')
	
		.join('coursProfils', 'profils.id','=', 'coursProfils.idProfil')
		.join('cours', 'coursProfils.idCours','=', 'cours.id')
		.select('profils.nom', 'session', 'sigle', 'titre', 'positionVerticale')
		.where('coursProfils.idProfil','=', idProfil)
		.orderBy(['positionVerticale', 'session']);

	return resultat;
}

app.get('/grilleCoursDeProfil', async (requete, reponse) => {
	const { id } = requete.query;

	const resultat = await grilleCoursDeProfil(id);

	reponse.send(templateTableau.templateTableau(resultat));
});

app.listen(4000, () => {
	console.log("Serveur en exécution");
});