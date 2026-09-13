# Comment on installe un agent chez une PME — et comment on le débranche

*Document Agentia · v1 · 13/09/2026*

Ce document décrit la méthode appliquée à chaque installation d'agent IA en entreprise. Il est volontairement court : quatre règles, et une procédure de sortie. C'est la partie que la plupart des prestataires n'abordent pas — et c'est pourtant celle qui décide si un projet est sain ou non.

---

## Les 4 règles d'installation

### 1. Permissions minimales : lecture et brouillons, jamais l'envoi
L'agent **lit** et **prépare**. Il ne **parle pas au nom de l'entreprise**.

Concrètement : sur une boîte mail, l'agent lit les messages, identifie les actions, et dépose des brouillons prêts à partir. **Un humain clique sur « envoyer ».** Toujours.

Pourquoi ce n'est pas négociable : un agent qui envoie seul au nom d'une entreprise engage sa responsabilité sur des propos qu'aucun humain n'a relus. Le coût d'une erreur est asymétrique — un brouillon en trop ne coûte rien, un email parti ne se rattrape pas.

*Exception encadrée : les envois internes à faible risque et les accusés de réception, après validation explicite et écrits noir sur blanc dans le contrat.*

### 2. Un compte dédié, jamais la boîte principale
L'agent travaille sur une adresse créée pour lui (ex. `prenom.agent@entreprise.fr`), jamais sur la boîte du dirigeant.

Trois raisons :
- **Réversible** : on supprime le compte, la boîte principale n'a jamais été touchée.
- **Traçable** : tout ce que l'agent a fait porte sa signature, on peut l'auditer.
- **Rassurant** : le dirigeant garde la main sur sa boîte personnelle — le point de blocage numéro un chez les patrons de PME.

### 3. Human-in-the-loop sur toute écriture
Trois niveaux, et on choisit explicitement pour chaque tâche :

| Niveau | Qui décide | Usage |
|---|---|---|
| **Lecture seule** | l'agent lit, ne fait rien | analyse, tri, veille, préparation |
| **Brouillon** *(le défaut)* | l'agent prépare, l'humain valide | emails, devis, réponses clients |
| **Autonome** | l'agent agit seul | uniquement les tâches internes à risque nul, listées au contrat |

**Règle de conception : par défaut, brouillon.** Le mode autonome s'ajoute tâche par tâche, après observation, et jamais sur une écriture qui sort de l'entreprise.

### 4. Prévoir la sortie — ce qui se passe le jour où on débranche *(la règle oubliée)*
Avant de déployer, on écrit noir sur blanc : **si l'entreprise arrête, ou si nous ne sommes plus là, qu'est-ce qui reste ?**

Trois choses doivent survivre à l'agent :

**a. Les données qu'il a produites.** Tous les documents, les brouillons, les rapports et les analyses doivent être livrés dans des formats ouverts, dans un dossier de l'entreprise — pas seulement dans le tableau de bord d'un prestataire.

**b. Les journaux de ce qu'il a fait.** Ce qui a tourné, ce qui a échoué, ce qui a été décidé. Sans ça, personne ne peut reprendre la suite. On garde l'historique d'exécution, les fichiers d'état, et la liste de ses accès.

**c. Les secrets qu'il a créés.** Un agent crée des clés API, des jetons, des comptes de service. Il faut en tenir **un registre** dès le premier jour : quelle clé, à qui elle appartient, où elle est stockée, et comment on la révoque. Un agent qu'on débranche sans révoquer ses clés laisse des portes ouvertes.

**Et la bonne question à poser en réunion, dès le départ :** *« le jour où on arrête, qui reprend, et avec quoi ? »* Si personne ne peut répondre, l'installation n'est pas finie.

---

## Checklist d'installation

- [ ] Compte dédié créé (jamais la boîte principale)
- [ ] Niveau de permission choisi **par tâche** (lecture / brouillon / autonome)
- [ ] Écrit que l'agent ne peut pas envoyer hors de l'entreprise sans validation humaine
- [ ] **Registre des secrets** ouvert (clé, propriétaire, emplacement, révocation)
- [ ] Dossier de livrables dans les systèmes de l'entreprise (formats ouverts)
- [ ] Mécanisme de journalisation actif (ce qui a tourné, ce qui a échoué)
- [ ] Procédure de sortie écrite et validée par le client
- [ ] Test de débranchement réel : on coupe l'agent une journée et on vérifie que l'entreprise continue de tourner

---

## Pourquoi cette méthode se vend

Un dirigeant qui envisage d'automatiser a deux peurs : *« ça va parler à ma place »* et *« je vais dépendre de vous »*.

Les règles 1 à 3 répondent à la première. **La règle 4 répond à la seconde** — et c'est celle que personne ne met sur la table. Un prestataire qui explique spontanément comment on le débranche envoie exactement le signal inverse de celui qu'on attend d'un vendeur de logiciel : il montre qu'il construit quelque chose qui **appartient au client**.

**À placer en réunion, sans y être invité :** *« Avant qu'on commence, je veux qu'on parle de la fin. Voilà ce qui vous restera si vous arrêtez demain. »*
