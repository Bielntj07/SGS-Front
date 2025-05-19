import Image from 'next/image';
import salabanner from '@/assets/images/salabanner.jpg';

export default function Home() {
  return (
    <div style={{width:'100%',overflowX:'hidden'}}>
      {/* Banner */}
      <div style={{position:'relative',width:'100%',height:'350px',maxHeight:'350px',overflow:'hidden'}}>
        <Image
          src={salabanner}
          alt="Banner de Sala"
          fill
          style={{objectFit:'cover',zIndex:1}}
          priority
        />
        <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',background:'rgba(30,30,30,0.57)',zIndex:2,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <h1 style={{color:'#fff',fontSize:'2.3rem',fontWeight:800,letterSpacing:1,marginBottom:'0.7rem',textShadow:'0 2px 16px #000'}}>SGS - Sistema de Gerenciamento de Salas</h1>
          <p style={{color:'#e0e0e0',fontSize:'1.15rem',maxWidth:650,textAlign:'center',textShadow:'0 2px 8px #000',lineHeight:1.5,marginBottom:0}}>
            Bem-vindo ao SGS! Organize, reserve e gerencie salas de forma simples, eficiente e moderna. Tenha controle total sobre reservas, disponibilidade e recursos de cada sala. O SGS foi criado para facilitar a rotina de escolas, empresas e instituições.
          </p>
        </div>
      </div>
      {/* Cards de recursos */}
      <div style={{
        display:'flex',
        gap:'2.2rem',
        flexWrap:'wrap',
        justifyContent:'center',
        marginTop:'2.8rem',
        paddingBottom:'2.5rem',
        flexDirection: typeof window !== 'undefined' && window.innerWidth <= 600 ? 'column' : 'row',
        alignItems: typeof window !== 'undefined' && window.innerWidth <= 600 ? 'center' : 'stretch',
        width: '100%'
      }}>
        {/* Card: Reservar Sala */}
        <div style={{background:'rgba(255,255,255,0.97)',borderRadius:16,padding:'1.6rem 1.5rem',minWidth:220,maxWidth:250,boxShadow:'0 2px 16px #0002',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <span style={{fontSize:'2.2rem',marginBottom:10}}>📝</span>
          <h3 style={{fontWeight:700,fontSize:'1.18rem',marginBottom:6,color:'#41452f'}}>Reservar Sala</h3>
          <p style={{color:'#444',fontSize:'1rem',textAlign:'center'}}>Realize reservas de salas de maneira rápida e prática, escolhendo data e horário conforme sua necessidade.</p>
        </div>
        {/* Card: Consultar Reservas */}
        <div style={{background:'rgba(255,255,255,0.97)',borderRadius:16,padding:'1.6rem 1.5rem',minWidth:220,maxWidth:250,boxShadow:'0 2px 16px #0002',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <span style={{fontSize:'2.2rem',marginBottom:10}}>🔍</span>
          <h3 style={{fontWeight:700,fontSize:'1.18rem',marginBottom:6,color:'#41452f'}}>Consultar Reservas</h3>
          <p style={{color:'#444',fontSize:'1rem',textAlign:'center'}}>Consulte rapidamente todas as reservas feitas, verifique disponibilidade e evite conflitos de agendamento.</p>
        </div>
        {/* Card: Suporte */}
        <div style={{background:'rgba(255,255,255,0.97)',borderRadius:16,padding:'1.6rem 1.5rem',minWidth:220,maxWidth:250,boxShadow:'0 2px 16px #0002',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <span style={{fontSize:'2.2rem',marginBottom:10}}>💬</span>
          <h3 style={{fontWeight:700,fontSize:'1.18rem',marginBottom:6,color:'#41452f'}}>Suporte</h3>
          <p style={{color:'#444',fontSize:'1rem',textAlign:'center'}}>Conte com ajuda para dúvidas, sugestões ou problemas. Nossa equipe está pronta para te apoiar!</p>
        </div>
      </div>
    </div>
  );
}
