# Publication LinkedIn — Granite 3.3 2B, du pilote à la confirmation

Un pilote prometteur n'est pas une preuve. J'ai donc lancé le test apparié plus large.

Sur 8 nouvelles questions officielles `lm-eval`, Granite 3.3 2B est passé de **25 % seul à 75 % avec une couche d'experts déterministes vérifiés** : +50 points, 4 gains appariés et 0 perte. Le signal était encourageant, mais l'échantillon trop petit (`p = 0,125`).

La confirmation sur 100 questions donne :

- **LLM seul : 22/100 (22 %)**
- **LLM + couche d'experts vérifiés : 51/100 (51 %)**
- **Gain : +29 points de pourcentage**
- **29 gains appariés, 0 perte, 71 égalités**
- **McNemar exact p = 3,7 × 10⁻⁹**

Le gain se concentre là où le résultat peut être vérifié mécaniquement : l'arithmétique multiétape BBH passe de 0 % à 100 %, et la compréhension de dates BBH de 0 % à 16 %. GSM8K et TriviaQA restent inchangés.

La limite honnête est importante : ce test confirme la valeur de la **couche d'experts déterministes vérifiés sur cette sélection**. Il n'établit pas un gain séparé de l'orchestration Nexus, et MATmem n'a pas été exercé dans ce test.

Questions nouvelles. Exécution sans accès aux cibles. Prompts, filtres et évaluateurs officiels inchangés. Aucune réutilisation de réponse. Aucun apprentissage automatique depuis le jeu de test.

Preuves et empreintes : https://github.com/sxc3030-eng/mat-nexus-showcase

Benchmark exécuté sur Hugging Face Jobs. Rapport synthétisé et visualisé avec GPT-5 Codex.

#IAlocale #LLM #IngenierieIA #MachineLearning #HuggingFace #Benchmark
