'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import salabanner from '@/assets/images/salabanner.jpg';
import './home-cards.css';
import './card-button.css';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 600);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const router = useRouter();
  return (
    <div style={{width:'100%',overflowX:'hidden',paddingLeft:isMobile?'1.2rem':0,paddingRight:isMobile?'1.2rem':0}}>
      {/* Banner */}
      <div style={{position:'relative',width:'100%',height:isMobile?'120px':'350px',minHeight:isMobile?'80px':'unset',maxHeight:isMobile?'120px':'350px',overflow:'hidden',borderRadius:isMobile?'0 0 18px 18px':'18px',marginBottom:isMobile?'0.7rem':'2.2rem',boxShadow:'0 2px 18px #0003',paddingLeft:isMobile?'0.2rem':0,paddingRight:isMobile?'0.2rem':0}}>
        <Image
          src={salabanner}
          alt="Banner de Sala"
          fill
          style={{objectFit:'cover',zIndex:1}}
          priority
        />
        {!isMobile && (
          <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',background:'rgba(30,30,30,0.57)',zIndex:2,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2.2rem 2.5rem',boxSizing:'border-box'}}>
            <h1 style={{color:'#fff',fontSize:'2.3rem',fontWeight:800,letterSpacing:1,marginBottom:'0.7rem',textShadow:'0 2px 16px #000',textAlign:'center',lineHeight:1.16}}>
              SGS - Sistema de Gerenciamento de Salas
            </h1>
            <p style={{color:'#e0e0e0',fontSize:'1.15rem',width:650,maxWidth:650,textAlign:'center',textShadow:'0 2px 8px #000',lineHeight:1.5,marginBottom:0,padding:'0.2rem 0.3rem',borderRadius:'8px',wordBreak:'break-word',whiteSpace:'normal',overflowWrap:'break-word'}}>
              Bem-vindo ao SGS! Organize, reserve e gerencie salas de forma simples, eficiente e moderna. Tenha controle total sobre reservas, disponibilidade e recursos de cada sala. O SGS foi criado para facilitar a rotina de escolas, empresas e instituições.
            </p>
          </div>
        )}
      </div>
      {isMobile && (
        <div style={{width:'100%',background:'rgba(30,30,30,0.93)',borderRadius:'0 0 18px 18px',margin:'0 0 1.1rem 0',padding:'1.1rem 0.7rem 1.2rem 0.7rem',boxSizing:'border-box',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <h1 style={{color:'#fff',fontSize:'1.2rem',fontWeight:800,letterSpacing:1,marginBottom:'0.6rem',textShadow:'0 2px 12px #000',textAlign:'center',lineHeight:1.16}}>
            SGS - Sistema de Gerenciamento de Salas
          </h1>
          <p style={{color:'#e0e0e0',fontSize:'1rem',width:'100%',textAlign:'center',textShadow:'0 2px 8px #000',lineHeight:1.5,marginBottom:0,padding:'0.2rem 0.3rem',borderRadius:'8px',wordBreak:'break-word',whiteSpace:'normal',overflowWrap:'break-word'}}>
            Bem-vindo ao SGS! Organize, reserve e gerencie salas de forma simples, eficiente e moderna. Tenha controle total sobre reservas, disponibilidade e recursos de cada sala. O SGS foi criado para facilitar a rotina de escolas, empresas e instituições.
          </p>
        </div>
      )}
      
      {/* Cards de recursos */}
      <div style={{
        maxWidth:1150,
        marginLeft:'auto',
        marginRight:'auto',
        display:'flex',
        gap:isMobile?'1.1rem':'1.5rem',
        flexWrap:'wrap',
        justifyContent: isMobile ? 'center' : 'space-between',
        marginTop:isMobile?'1.2rem':'2.8rem',
        paddingBottom:isMobile?'1.2rem':'2.5rem',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'center' : 'stretch',
        width: '100%'
      }}>
        {/* Card: Reservar Sala */}
        <div className="home-card" style={{borderRadius:16,padding:isMobile?'1.1rem 0.7rem':'1.6rem 1.5rem',minWidth:isMobile?'unset':220,maxWidth:'98vw',width:isMobile?'100%':'300px',boxShadow:'0 2px 16px #0002',display:'flex',flexDirection:'column',alignItems:'center',margin:isMobile?'0 auto':'unset'}}>
          <span style={{fontSize:'2.2rem',marginBottom:10}}>📅</span>
          <h3 style={{fontWeight:700,fontSize:'1.18rem',marginBottom:6}}>Reservar Sala</h3>
          <p style={{fontSize:'1rem',textAlign:'center'}}>Realize reservas de salas de maneira rápida e prática, escolhendo data e horário conforme sua necessidade.</p>
          <button className="card-btn" onClick={() => router.push('/gerencia/salas')}>Reservar uma sala</button>
        </div>
        {/* Card: Consultar Reservas */}
        <div className="home-card" style={{borderRadius:16,padding:isMobile?'1.1rem 0.7rem':'1.6rem 1.5rem',minWidth:isMobile?'unset':220,maxWidth:'98vw',width:isMobile?'100%':'300px',boxShadow:'0 2px 16px #0002',display:'flex',flexDirection:'column',alignItems:'center',margin:isMobile?'0 auto':'unset'}}>
          <span style={{fontSize:'2.2rem',marginBottom:10}}>🔍</span>
          <h3 style={{fontWeight:700,fontSize:'1.18rem',marginBottom:6}}>Consultar Reservas</h3>
          <p style={{fontSize:'1rem',textAlign:'center'}}>Consulte rapidamente todas as reservas feitas, verifique disponibilidade e evite conflitos de agendamento.</p>
          <button className="card-btn" onClick={() => router.push('/consulta/salas')}>Consulte uma reserva</button>
        </div>
        {/* Card: Suporte */}
        <div className="home-card" style={{borderRadius:16,padding:isMobile?'1.1rem 0.7rem':'1.6rem 1.5rem',minWidth:isMobile?'unset':220,maxWidth:'98vw',width:isMobile?'100%':'300px',boxShadow:'0 2px 16px #0002',display:'flex',flexDirection:'column',alignItems:'center',margin:isMobile?'0 auto':'unset'}}>
          <span style={{fontSize:'2.2rem',marginBottom:10}}>💬</span>
          <h3 style={{fontWeight:700,fontSize:'1.18rem',marginBottom:6}}>Suporte</h3>
          <p style={{fontSize:'1rem',textAlign:'center'}}>Conte com ajuda para dúvidas, sugestões ou problemas. Nossa equipe está pronta para te apoiar!</p>
          <a className="card-btn" href="mailto:guilherme.rodrigues@aluno.faculdadeimpacta.com.br">Contatar</a>
        </div>
      </div>
    </div>
  );
}
