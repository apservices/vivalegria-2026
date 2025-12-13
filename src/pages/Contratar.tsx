{/* Formulário de Contratação */}
{packageType && (
  <section id="contratacao-form" className="py-16 bg-viva-offwhite">
    <div className="container mx-auto px-4 relative">
      {/* Mascote "segurando telefone" – aparece em tablet e PC, escondido no celular */}
      <Mascote
        pose="cadastro"
        animation="fadeIn"
        className="hidden md:block w-40 lg:w-48 xl:w-56 absolute bottom-4 right-4 z-20 drop-shadow-2xl"
      />

      {/* Conteúdo principal do formulário com z-index maior pra ficar por cima */}
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Complete Sua Reserva</h2>
          <p className="text-muted-foreground">
            Preencha o formulário abaixo para finalizar sua reserva
          </p>
        </div>
        <ContratacaoForm />
      </div>
    </div>
  </section>
)}