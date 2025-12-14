import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { maskPhone, maskCEP } from "@/utils/inputMasks";
import type { StepProps } from "./types";

export const StepDadosContratante = ({
  formData,
  updateFormData,
  errors,
}: StepProps) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ telefone: maskPhone(e.target.value) });
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ cep: maskCEP(e.target.value) });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Dados do Contratante
        </h2>
        <p className="text-muted-foreground">Preencha seus dados de contato</p>
      </div>

      {/* Nome Completo */}
      <div className="space-y-2">
        <Label htmlFor="nomeCompleto" className="text-base font-medium">
          Nome Completo *
        </Label>
        <Input
          id="nomeCompleto"
          type="text"
          value={formData.nomeCompleto}
          onChange={(e) => updateFormData({ nomeCompleto: e.target.value })}
          placeholder="Digite seu nome completo"
          className={errors.nomeCompleto ? "border-destructive" : ""}
        />
        {errors.nomeCompleto && (
          <p className="text-sm text-destructive">{errors.nomeCompleto}</p>
        )}
      </div>

      {/* Telefone */}
      <div className="space-y-2">
        <Label htmlFor="telefone" className="text-base font-medium">
          Telefone *
        </Label>
        <Input
          id="telefone"
          type="tel"
          value={formData.telefone}
          onChange={handlePhoneChange}
          placeholder="(00) 00000-0000"
          className={errors.telefone ? "border-destructive" : ""}
        />
        {errors.telefone && (
          <p className="text-sm text-destructive">{errors.telefone}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-base font-medium">
          E-mail *
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          placeholder="seu@email.com"
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      {/* Confirmação de Email */}
      <div className="space-y-2">
        <Label htmlFor="emailConfirmacao" className="text-base font-medium">
          Confirmação de E-mail *
        </Label>
        <Input
          id="emailConfirmacao"
          type="email"
          value={formData.emailConfirmacao}
          onChange={(e) => updateFormData({ emailConfirmacao: e.target.value })}
          placeholder="Confirme seu e-mail"
          className={errors.emailConfirmacao ? "border-destructive" : ""}
        />
        {errors.emailConfirmacao && (
          <p className="text-sm text-destructive">{errors.emailConfirmacao}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CEP */}
        <div className="space-y-2">
          <Label htmlFor="cep" className="text-base font-medium">
            CEP
          </Label>
          <Input
            id="cep"
            type="text"
            value={formData.cep}
            onChange={handleCepChange}
            placeholder="00000-000"
          />
        </div>

        {/* Cidade */}
        <div className="space-y-2">
          <Label htmlFor="cidade" className="text-base font-medium">
            Cidade
          </Label>
          <Input
            id="cidade"
            type="text"
            value={formData.cidade}
            onChange={(e) => updateFormData({ cidade: e.target.value })}
            placeholder="Sua cidade"
          />
        </div>
      </div>

      {/* Endereço */}
      <div className="space-y-2">
        <Label htmlFor="endereco" className="text-base font-medium">
          Endereço
        </Label>
        <Input
          id="endereco"
          type="text"
          value={formData.endereco}
          onChange={(e) => updateFormData({ endereco: e.target.value })}
          placeholder="Rua, número"
        />
      </div>

      {/* Complemento */}
      <div className="space-y-2">
        <Label htmlFor="complemento" className="text-base font-medium">
          Complemento
        </Label>
        <Input
          id="complemento"
          type="text"
          value={formData.complemento}
          onChange={(e) => updateFormData({ complemento: e.target.value })}
          placeholder="Apartamento, bloco, etc."
        />
      </div>
    </div>
  );
};
