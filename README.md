jmpresseditor2.js
=================

Second version of the impress.js editor


Editeur Jmpress nouvelle version, mode d'emploi
Lancer le fichier HTMLpage.html pour accéder à l'éditeur 100% Javascript dont seulement 3000 lignes très aérées et documentées sont nécessaires (hors bibliothèques Mustache, Jquery, SimpleInheritance, Watch)


En terme de vocabulaire, une présentation est composée de composants répartis en deux famille; les slides et les éléments. Les éléments n'existent que dans les slides et peuvent être du texte ou bien une image. Il faut au moins une slide pour ajouter des éléments.
Avec le clavier
 
Créer des éléments
Pour peu que le curseur ne survole aucuns composants (ni slides, ni éléments), il est possible de créer des composants en appuyant sur les lettres présentées ci-dessus à savoir :
•  j : slide
•	k : texte de titre 1 (gros)
•	l : texte de titre 2
•	m : texte de titre 1 (petit)
•	ù : texte de corps de texte
•	* : Image

L'ajout de slide se fait au centre de la présentation, l'ajout d'élément se fait au milieu de la slide. Les textes peuvent se superposer, pas les images.
L'ajout d'un élément (texte divers ou image) demande à l'user de sélectionner une slide en cliquant sur l'une d'elle. L'ajout d'une image demande la source de l'image qui peut être un fichier dans le dossier Image à la racine ou bien une URL d'une image sur internet. 

Déplacer un composant
Lorsque le curseur survole un composant (une slide ou du texte ou une image) vous pouvez déplacer le composant en utilisant les touches comme mentionnées ci-dessus à savoir :
•	z : Y vers le haut
•	x : Y vers le bas
•	q : X vers  la droite
•	s : X cers la gauche
•	a : Z en profondeur (n'existe que pour les slides)
•	x : Z en hauteur (n'existe que pour les slides)

Les slides peuvent également subir une rotation selon le même principe. Les lettres (X,Y,Z) mentionnées ci-dessus correspondent aux axes d'un tétraèdre régulier dont le plan (0,X,Y) est celui de l'écran au début de la présentation. Lorsque la caméra aura tournée le plan de l'écran ne sera plus le même.

Se déplacer dans la présentation
Lorsque le curseur ne survole aucunes slides ni aucuns composants les mêmes touches que pour le déplacement et la rotation des slides permettent de se déplacer dans la présentation et de la faire tourner.
Pour le moment la rotation se fait avec comme centre de rotation le centre de la présentation. C'est contre-intuitif et il est facile de se perdre dans le monde des slides. Afin de constater l'effet de la rotation le mieux est de se mettre proche du centre du monde des slides c’est-à-dire de sorte à bien voir la slide 'profondeur' (utiliser les flèches pour passer d'une slide à l'autre).

Editer le texte
Un simple click sur un élément texte permet de l'éditer. 




