# MAT Nexus V7 : remise à zéro des preuves avant le test des experts

La préversion V7 est emballée, mais ce n'est pas une annonce de victoire. C'est un point de départ plus propre pour la prochaine évaluation causale.

## Ce qui est vérifié aujourd'hui

- **52/52 tests ciblés de livraison réussissent** pour le paquet Windows, le contrat d'installation, les profils et la garde de contexte Granite.
- Une précédente campagne publique et autonome du garde-fou reste reproductible : Granite passe de **3/18 à 18/18**, Gemma de **3/18 à 15/18** et Llama de **1/6 à 6/6**. Ces petits jeux mécaniquement vérifiables constituent une preuve utile, mais pas une revendication universelle.
- Une étude interne historique contrôlée de 800 questions a mesuré Granite direct à **51/800 (6,375 %)**, le routage par experts à **648/800 (81,0 %)**, Nexus adaptatif à **698/800 (87,25 %)** et l'exécuteur déterministe à **800/800 (100 %)**. Le corpus étant contrôlé par gabarits, ces chiffres ne démontrent **pas** une performance générale ou officielle.

## Ce qui a été rejeté

La tentative AgentDojo récente est invalide comme comparaison pairée. Seulement **5/40** cas du bras brut ont terminé avant un dépassement de contexte (**8 670 jetons d'entrée pour une limite de 8 192**); le bras Nexus n'a jamais démarré. Elle n'a donc **aucun score d'exactitude et aucune conclusion gain/perte**.

Rejeter une exécution ratée fait partie du produit. Un harnais incapable de dire « aucun résultat » n'est pas fiable.

## Le prochain test décisif

La prochaine campagne isolera l'hypothèse principale du produit :

> **LLM seul contre le même LLM aidé par une équipe parcimonieuse de 3 à 6 experts qualifiés.**

Elle utilisera des questions fraîches et scellées, des réglages identiques, une notation pairée, des résultats par domaine, le suivi des abstentions, de la latence et du coût en jetons. L'orchestration Nexus sera évaluée séparément ensuite afin de ne pas confondre la valeur des experts et celle du routeur.

La source officielle tau3 est déjà épinglée et auditée : **278 tâches centrales, 0 consommée et aucune sélection de test créée**. Aucune réponse scellée ne servira au réglage.

MAT Nexus V7 gagnera sa revendication avec ces nouveaux résultats pairés, pas avec un numéro de version.

