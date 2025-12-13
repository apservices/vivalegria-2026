{/* Premium Packages */}
<section className="py-24 bg-gradient-subtle">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="mb-4">Experiências Especiais</h2>
      <p className="text-lg text-muted-foreground">
        Serviços premium para tornar sua festa ainda mais incrível
      </p>
    </div>

    {/* Wrapper relativo com o mascote flutuando à direita */}
    <div className="relative max-w-5xl mx-auto">
      {/* Mascote apontando pros cards premium – aparece só em telas grandes (XL+) */}
      <Mascote
        pose="banner"
        animation="balanco"
        className="hidden xl:block w-48 xl:w-56 absolute -right-32 top-10 z-10 drop-shadow-2xl"
      />

      {/* Grid dos cards premium */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {premiumPackages.map((pkg, index) => (
          <Card key={index} className="p-8 hover-lift border-2 border-dashed border-primary/30">
            <span className={`${pkg.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-flex items-center gap-1`}>
              <pkg.badgeIcon className="w-3 h-3" />
              {pkg.badge}
            </span>
            <h2 className="text-3xl font-bold mb-2">{pkg.name}</h2>
            <p className="text-sm text-primary font-semibold mb-3">{pkg.audience}</p>
            <p className="text-muted-foreground mb-4">{pkg.description}</p>
            <div className="p-4 bg-background rounded-lg mb-6 border">
              <p className="text-2xl font-bold text-primary">A partir de {pkg.startPrice}</p>
            </div>
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                O que está incluso:
              </h3>
              {pkg.features.map((feature, i) => (
                <div key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            {pkg.note && (
              <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg mb-6 italic">
                💡 {pkg.note}
              </p>
            )}
            <Button asChild className="w-full rounded-full" variant="outline">
              <a href="https://wa.me/5511965982251" target="_blank" rel="noopener noreferrer">
                💬 Consultar no WhatsApp
              </a>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  </div>
</section>
      </div>
    </>
  );
};

export default Pacotes;  // <--- ESSA LINHA É OBRIGATÓRIA!
