'use client';
import React, { createContext, useContext, useState } from 'react';

const WorkflowContext = createContext<any>(null);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState({
    description: '',
    epics: [],
    analysis: null,
    assignments: []
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <WorkflowContext.Provider value={{ 
      currentStep, setCurrentStep, nextStep, prevStep, 
      projectData, setProjectData 
    }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export const useWorkflow = () => useContext(WorkflowContext);