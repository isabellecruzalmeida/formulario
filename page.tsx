'use client';

import React, { useState, FormEvent } from 'react';
import './form.css';

export default function FormularioPage() {
    const [formData, setFormData] = useState({
        nome: '',
        formacao: '',
        cursoSuperior: '',
        tecnico: '',
        nomeTecnico: '',
        excel: '',
        word: '',
        powerpoint: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [buttonState, setButtonState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setButtonState('submitting');
        
        try {
            // Pequeno delay para efeito visual agradável
            await new Promise(r => setTimeout(r, 800));

            // Chamada direta para a API no mesmo projeto
            const res = await fetch('/api/candidatos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Falha no servidor');

            setButtonState('success');
            setShowToast(true);

            // Esconde aviso e reseta após 4 segundos
            setTimeout(() => {
                setShowToast(false);
                setButtonState('idle');
                setIsSubmitting(false);
                setFormData({
                    nome: '',
                    formacao: '',
                    cursoSuperior: '',
                    tecnico: '',
                    nomeTecnico: '',
                    excel: '',
                    word: '',
                    powerpoint: ''
                });
            }, 4000);

        } catch (error) {
            console.error(error);
            setButtonState('error');
            setTimeout(() => {
                setButtonState('idle');
                setIsSubmitting(false);
            }, 3000);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="form-container">
                <h1>Avaliação de Perfil</h1>
                <form onSubmit={handleSubmit}>
                    
                    {/* Nome */}
                    <div className="form-group">
                        <label className="required" htmlFor="nome">Qual o seu nome?</label>
                        <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Digite seu nome completo" required />
                    </div>

                    {/* Formação */}
                    <div className="form-group">
                        <label className="required">Qual sua formação?</label>
                        <div className="radio-group">
                            {['Ensino Fundamental', 'Ensino Médio', 'Ensino Superior'].map(opcao => (
                                <label key={opcao} className={`radio-option ${formData.formacao === opcao ? 'selected' : ''}`}>
                                    <input type="radio" name="formacao" value={opcao} checked={formData.formacao === opcao} onChange={handleChange} required />
                                    <div className="radio-circle"></div>
                                    {opcao}
                                </label>
                            ))}
                        </div>
                        
                        <div className={`conditional-input ${formData.formacao === 'Ensino Superior' ? 'show' : ''}`}>
                            <label htmlFor="cursoSuperior">Informe qual curso superior:</label>
                            <input type="text" id="cursoSuperior" name="cursoSuperior" value={formData.cursoSuperior} onChange={handleChange} placeholder="Ex: Administração, Sistemas de Informação..." required={formData.formacao === 'Ensino Superior'} />
                        </div>
                    </div>

                    {/* Curso Técnico */}
                    <div className="form-group">
                        <label className="required">Possui curso Técnico?</label>
                        <div className="radio-group">
                            {['Não', 'Sim'].map(opcao => (
                                <label key={opcao} className={`radio-option ${formData.tecnico === opcao ? 'selected' : ''}`}>
                                    <input type="radio" name="tecnico" value={opcao} checked={formData.tecnico === opcao} onChange={handleChange} required />
                                    <div className="radio-circle"></div>
                                    {opcao}
                                </label>
                            ))}
                        </div>
                        
                        <div className={`conditional-input ${formData.tecnico === 'Sim' ? 'show' : ''}`}>
                            <label htmlFor="nomeTecnico">Se sim, qual o curso?</label>
                            <input type="text" id="nomeTecnico" name="nomeTecnico" value={formData.nomeTecnico} onChange={handleChange} placeholder="Ex: Informática, Administração..." required={formData.tecnico === 'Sim'} />
                        </div>
                    </div>

                    <h2 className="section-title">Qual o nível de conhecimento nesses sistemas?</h2>
                    
                    {/* Conhecimentos */}
                    <div className="form-group">
                        {['excel', 'word', 'powerpoint'].map(sys => (
                            <div key={sys} className="rating-container">
                                <div className="rating-label">{sys.charAt(0).toUpperCase() + sys.slice(1)} (1 a 5)</div>
                                <div className="rating-scales">
                                    {[1, 2, 3, 4, 5].map(val => (
                                        <label key={val} className="rating-option">
                                            <input type="radio" name={sys} value={val} checked={formData[sys as keyof typeof formData] === String(val)} onChange={handleChange} required />
                                            <div className="rating-box">{val}</div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting} style={{ 
                        opacity: buttonState === 'submitting' ? 0.8 : 1,
                        background: buttonState === 'success' ? '#10b981' : buttonState === 'error' ? '#ef4444' : ''
                    }}>
                        {buttonState === 'idle' && 'Enviar'}
                        {buttonState === 'submitting' && 'Enviando...'}
                        {buttonState === 'success' && 'Enviado com sucesso!'}
                        {buttonState === 'error' && 'Falha ao enviar'}
                    </button>
                </form>
            </div>

            {/* Aviso estilo Toast */}
            <div className={`toast ${showToast ? 'show' : ''}`}>
                <span className="toast-icon">✓</span>
                <span className="toast-message">Seus dados foram encaminhados com sucesso!</span>
            </div>
        </div>
    );
}
