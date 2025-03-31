
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import MemberForm from '@/components/members/MemberForm';
import { useMembers, Membro } from '@/contexts/MembersContext';

const MembroPerfil = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { members, getMember, updateMember, addMember } = useMembers();
  const [member, setMember] = useState<Membro | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pageTitle, setPageTitle] = useState('Perfil do Membro');

  useEffect(() => {
    // Verificar se estamos na rota de edição ou novo membro
    if (id === 'novo') {
      setPageTitle('Adicionar Novo Membro');
      setIsEditing(false);
      setMember(null);
    } else if (window.location.pathname.includes('/editar/')) {
      const memberToEdit = getMember(id || '');
      if (memberToEdit) {
        setPageTitle('Editar Membro');
        setIsEditing(true);
        setMember(memberToEdit);
      } else {
        navigate('/membros');
      }
    } else {
      // Visualização do perfil
      const memberToView = getMember(id || '');
      if (memberToView) {
        setPageTitle(`Perfil: ${memberToView.nome}`);
        setIsEditing(false);
        setMember(memberToView);
      } else {
        navigate('/membros');
      }
    }
  }, [id, getMember, navigate]);

  const handleFormSubmit = (data: Membro) => {
    if (isEditing || id !== 'novo') {
      updateMember(data);
    } else {
      addMember(data);
    }
    
    // Redirecionar para a lista de membros
    navigate('/membros');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title={pageTitle} 
        description={isEditing ? "Edite as informações do membro" : (id === 'novo' ? "Cadastre um novo membro" : "Visualize as informações do membro")}
        backButton={true}
      />
      
      <div className="mb-10">
        <MemberForm 
          defaultValues={member || undefined}
          isEditing={isEditing || id !== 'novo'}
          onSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
};

export default MembroPerfil;
