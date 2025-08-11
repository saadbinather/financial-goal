"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "es" | "pt";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation and Headers
    "app.title": "Goal Tracker",
    "add.goal": "Add Goal",
    dashboard: "Dashboard",
    "dashboard.subtitle": "Track your progress and manage your goals",
    "kanban.view": "Kanban View",

    // Goal Status
    "status.todo": "TO DO",
    "status.inprogress": "IN PROGRESS",
    "status.done": "DONE",

    // Goal Form
    "goal.name": "Goal Name",
    "goal.description": "Description",
    "goal.type": "Type",
    "goal.startDate": "Start Date",
    "goal.deadline": "Deadline",
    "goal.checkInPerson": "Check-in Person",
    "goal.checkInEmail": "Check-in Email",
    "goal.targetAmount": "Target Amount",
    "goal.currentAmount": "Current Amount",
    "goal.category": "Category",

    // Placeholders
    "placeholder.name": "Enter goal name",
    "placeholder.description": "Describe your goal",
    "placeholder.email": "Enter email address",
    "placeholder.amount": "0.00",
    "placeholder.search": "Search goals...",
    "placeholder.sort": "Sort by",
    "placeholder.category": "Category",
    "placeholder.status": "Status",

    // Buttons
    "button.add": "Add Goal",
    "button.edit": "Edit",
    "button.delete": "Delete",
    "button.save": "Save Changes",
    "button.cancel": "Cancel",
    "button.addAmount": "Add Amount",
    "button.close": "Close",
    "button.help": "Help",
    "button.disclaimer": "Disclaimer",

    // Messages
    "message.noGoals": "No goals yet",
    "message.addSuccess": "Goal added successfully!",
    "message.editSuccess": "Goal updated successfully!",
    "message.deleteSuccess": "Goal deleted successfully!",
    "message.amountAdded": "Amount added successfully!",
    "message.noGoalsFound": "No goals found",
    "message.createFirstGoal": "Create your first goal to get started!",
    "message.adjustFilters": "Try adjusting your filters to see more goals.",
    "message.updateGoalDetails": "Update your goal details",

    // Progress
    "progress.title": "Progress",

    // Categories
    "category.personal": "Personal",
    "category.work": "Work",
    "category.financial": "Financial",
    "category.health": "Health",
    "category.education": "Education",
    "category.other": "Other",
    "category.all": "All Categories",

    // Types
    "type.short": "Short-term",
    "type.medium": "Medium-term",
    "type.long": "Long-term",

    // Sort Options
    "sort.deadline": "Deadline",
    "sort.amount": "Amount",
    "sort.progress": "Progress",
    "sort.name": "Name",
    "sort.all": "All Status",

    // Language Selector
    "language.english": "English",
    "language.spanish": "Español",
    "language.portuguese": "Português",
  },
  es: {
    // Navigation and Headers
    "app.title": "Seguimiento de Metas",
    "add.goal": "Agregar Meta",
    dashboard: "Panel",
    "dashboard.subtitle": "Seguimiento de progreso y gestión de metas",
    "kanban.view": "Vista Kanban",

    // Goal Status
    "status.todo": "POR HACER",
    "status.inprogress": "EN PROGRESO",
    "status.done": "COMPLETADO",

    // Goal Form
    "goal.name": "Nombre de la Meta",
    "goal.description": "Descripción",
    "goal.type": "Tipo",
    "goal.startDate": "Fecha de Inicio",
    "goal.deadline": "Fecha Límite",
    "goal.checkInPerson": "Persona de Seguimiento",
    "goal.checkInEmail": "Email de Seguimiento",
    "goal.targetAmount": "Monto Objetivo",
    "goal.currentAmount": "Monto Actual",
    "goal.category": "Categoría",

    // Placeholders
    "placeholder.name": "Ingresa el nombre de la meta",
    "placeholder.description": "Describe tu meta",
    "placeholder.email": "Ingresa dirección de email",
    "placeholder.amount": "0.00",
    "placeholder.search": "Buscar metas...",
    "placeholder.sort": "Ordenar por",
    "placeholder.category": "Categoría",
    "placeholder.status": "Estado",

    // Buttons
    "button.add": "Agregar Meta",
    "button.edit": "Editar",
    "button.delete": "Eliminar",
    "button.save": "Guardar Cambios",
    "button.cancel": "Cancelar",
    "button.addAmount": "Agregar Monto",
    "button.close": "Cerrar",
    "button.help": "Ayuda",
    "button.disclaimer": "Descargo de responsabilidad",

    // Messages
    "message.noGoals": "Aún no hay metas",
    "message.addSuccess": "¡Meta agregada exitosamente!",
    "message.editSuccess": "¡Meta actualizada exitosamente!",
    "message.deleteSuccess": "¡Meta eliminada exitosamente!",
    "message.amountAdded": "¡Monto agregado exitosamente!",
    "message.noGoalsFound": "No se encontraron metas",
    "message.createFirstGoal": "¡Crea tu primera meta para comenzar!",
    "message.adjustFilters": "Intenta ajustar tus filtros para ver más metas.",
    "message.updateGoalDetails": "Actualiza los detalles de tu meta",

    // Progress
    "progress.title": "Progreso",

    // Categories
    "category.personal": "Personal",
    "category.work": "Trabajo",
    "category.financial": "Financiero",
    "category.health": "Salud",
    "category.education": "Educación",
    "category.other": "Otro",
    "category.all": "Todas las Categorías",

    // Types
    "type.short": "Corto Plazo",
    "type.medium": "Mediano Plazo",
    "type.long": "Largo Plazo",

    // Sort Options
    "sort.deadline": "Fecha Límite",
    "sort.amount": "Monto",
    "sort.progress": "Progreso",
    "sort.name": "Nombre",
    "sort.all": "Todos los Estados",

    // Language Selector
    "language.english": "English",
    "language.spanish": "Español",
    "language.portuguese": "Português",
  },
  pt: {
    // Navigation and Headers
    "app.title": "Rastreador de Metas",
    "add.goal": "Adicionar Meta",
    dashboard: "Painel",
    "dashboard.subtitle": "Rastreie seu progresso e gerencie suas metas",
    "kanban.view": "Visualização Kanban",

    // Goal Status
    "status.todo": "A FAZER",
    "status.inprogress": "EM ANDAMENTO",
    "status.done": "CONCLUÍDO",

    // Goal Form
    "goal.name": "Nome da Meta",
    "goal.description": "Descrição",
    "goal.type": "Tipo",
    "goal.startDate": "Data de Início",
    "goal.deadline": "Data Limite",
    "goal.checkInPerson": "Pessoa de Acompanhamento",
    "goal.checkInEmail": "Email de Acompanhamento",
    "goal.targetAmount": "Valor Alvo",
    "goal.currentAmount": "Valor Atual",
    "goal.category": "Categoria",

    // Placeholders
    "placeholder.name": "Digite o nome da meta",
    "placeholder.description": "Descreva sua meta",
    "placeholder.email": "Digite endereço de email",
    "placeholder.amount": "0.00",
    "placeholder.search": "Buscar metas...",
    "placeholder.sort": "Ordenar por",
    "placeholder.category": "Categoria",
    "placeholder.status": "Status",

    // Buttons
    "button.add": "Adicionar Meta",
    "button.edit": "Editar",
    "button.delete": "Excluir",
    "button.save": "Salvar Alterações",
    "button.cancel": "Cancelar",
    "button.addAmount": "Adicionar Valor",
    "button.close": "Fechar",
    "button.help": "Ajuda",
    "button.disclaimer": "Descargo de responsabilidade",

    // Messages
    "message.noGoals": "Ainda não há metas",
    "message.addSuccess": "Meta adicionada com sucesso!",
    "message.editSuccess": "Meta atualizada com sucesso!",
    "message.deleteSuccess": "Meta excluída com sucesso!",
    "message.amountAdded": "Valor adicionado com sucesso!",
    "message.noGoalsFound": "Nenhuma meta encontrada",
    "message.createFirstGoal": "Crie sua primeira meta para começar!",
    "message.adjustFilters": "Tente ajustar seus filtros para ver mais metas.",
    "message.updateGoalDetails": "Atualize os detalhes da sua meta",

    // Progress
    "progress.title": "Progresso",

    // Categories
    "category.personal": "Pessoal",
    "category.work": "Trabalho",
    "category.financial": "Financeiro",
    "category.health": "Saúde",
    "category.education": "Educação",
    "category.other": "Outro",
    "category.all": "Todas as Categorias",

    // Types
    "type.short": "Curto Prazo",
    "type.medium": "Médio Prazo",
    "type.long": "Longo Prazo",

    // Sort Options
    "sort.deadline": "Data Limite",
    "sort.amount": "Valor",
    "sort.progress": "Progresso",
    "sort.name": "Nome",
    "sort.all": "Todos os Status",

    // Language Selector
    "language.english": "English",
    "language.spanish": "Español",
    "language.portuguese": "Português",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
