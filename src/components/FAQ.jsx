export default function FAQ() {
  const faqItems = [
    {
      question: "Comment puis-je vendre un jeu ou une console sur GameSooq ?",
      answer:
        "C'est simple ! Créez un compte, sélectionnez le jeu ou la console que vous souhaitez vendre, ajoutez des photos, fixez un prix, et ajoutez une description. Les autres utilisateurs pourront voir votre annonce.",
      isRed: true,
    },
    {
      question: "L'échange de jeux et de consoles est-il sécurisé ?",
      answer:
        "GameSooq vous permet d'utiliser notre système de messagerie intégré pour organiser l'échange en toute sécurité. Toute interaction. Vous pouvez aussi consulter les évaluations des autres utilisateurs pour plus de confiance.",
      isRed: false,
    },
    {
      question: "L'application est-elle disponible sur Android et iOS ?",
      answer:
        "Oui, notre application est disponible sur les deux plateformes. Vous pouvez la télécharger depuis l'App Store etle Google Play Store. Vous pouvez aussi accéder au site en ligne.",
      isRed: false,
    },
    {
      question: "Comment fonctionne le système de chat ?",
      answer:
        "Le chat intégré vous permet de communiquer directement avec d'autres joueurs pour négocier des prix, poser des questions, ou organiser une rencontre pour l'échange.",
      isRed: true,
    },
    {
      question: "Vais-je recevoir des notifications pour mes annonces ?",
      answer:
        "Oui, vous recevrez des notifications en temps réel lorsque quelqu'un commente, offre un prix ou montre de l'intérêt pour vos annonces.",
      isRed: true,
    },
    {
      question: "Comment puis-je suivre mes transactions ?",
      answer:
        "Dans votre tableau de bord personnel, vous pouvez facilement suivre et gérer vos transactions. Vous pouvez voir l'état de vos ventes, achats et échanges en cours. Vous recevrez également des mises à jour par email.",
      isRed: false,
    },
  ];

  return (
    <section id="faq" className="text-white py-10 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h3 className="text-[#FF5555] text-sm uppercase tracking-wider font-medium">
            FAQ
          </h3>
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide">
            QUESTIONS FRÉQUEMMENT POSÉES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${
                item.isRed
                  ? "bg-[#FF5555]"
                  : "sm:bg-[#FF5555] lg:bg-transparent md:bg-transparent bg-[#FF5555] "
              }`}
            >
              <h3 className="font-bold text-lg mb-3">{item.question}</h3>
              <p className={`text-sm ${item.isRed ? "text-white" : "text-"}`}>
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
