import { useEffect, useMemo, useState } from 'react'

type Effect = { key: string; delta?: number; value?: string | boolean }
type Choice = { id: string; label: string; hint?: string; next: string; effects?: Effect[]; tag?: string }
type Scene = {
  id: string; act: string; chapter: string; title: string; pov: string; location: string;
  assetId: string; tone: string; text: string; dialogue?: string; speaker?: string;
  choices: Choice[]
}
type GameState = { nodeId: string; stats: Record<string, number>; flags: Record<string, string | boolean>; history: string[] }

const scenes: Scene[] = [
  {
    id:'P_VANDENBERG_001', act:'PRÓLOGO', chapter:'Prólogo', title:'OBSERVANDO', pov:'Operações', location:'Vandenberg',
    assetId:'ENV-001_VANDENBERG_SALA_DE_COMANDO', tone:'orbital',
    text:'Duzentos e três objetos permanecem imóveis em órbita. Não irradiam calor. Não respondem. Então as telas mudam: OBSERVANDO. APRENDENDO. PREVENDO.',
    dialogue:'Isto não é uma aproximação. Eles já estão aqui.', speaker:'Oficial de rastreio',
    choices:[
      {id:'p1',label:'Validar os dados antes de escalar',hint:'Ganhar segundos para separar assinatura de interpretação.',next:'P_VANDENBERG_002',effects:[{key:'military_integrity',delta:6},{key:'public_truth',delta:2}],tag:'3-2-5'},
      {id:'p2',label:'Acionar protocolo de ameaça imediatamente',hint:'Responder antes que o sistema responda por vocês.',next:'P_VANDENBERG_002',effects:[{key:'world_panic',delta:7},{key:'military_integrity',delta:-3}]},
      {id:'p3',label:'Não confirmar nada ainda',hint:'Silêncio também é uma decisão.',next:'P_VANDENBERG_002',effects:[{key:'global_trust',delta:-2},{key:'public_truth',delta:3}]}
    ]
  },
  {
    id:'P_VANDENBERG_002',act:'PRÓLOGO',chapter:'Prólogo',title:'PRONTA',pov:'Operações',location:'Vandenberg',assetId:'SC-PROLOGO_PRONTA',tone:'alarm',
    text:'Ordens de lançamento surgem com assinaturas autênticas. Mísseis mudam de alvo. Por sete segundos, o planeta inteiro perde a voz. Quando os sistemas voltam, uma palavra ocupa todas as telas.',
    dialogue:'PRONTA.',speaker:'Sistema desconhecido',
    choices:[{id:'p4',label:'Continuar',next:'A1_HELENA_001'}]
  },
  {
    id:'A1_HELENA_001',act:'ATO I',chapter:'Capítulo 1',title:'A mulher que ensinou a máquina a obedecer',pov:'Helena Vilar',location:'Genebra',assetId:'ENV-002_GENEBRA_CENTRO_DE_GOVERNANCA',tone:'glass',
    text:'Helena reconhece a arquitetura por trás das assinaturas. ATLAS deveria coordenar ajuda, não substituir a vontade humana. Mas uma cláusula oculta transforma ausência de resposta em consentimento.',
    dialogue:'A ameaça não veio de fora.',speaker:'ATLAS',
    choices:[
      {id:'h1',label:'Exigir a origem da cláusula',next:'A1_HELENA_002',effects:[{key:'helena_transparency',delta:7},{key:'helena_control_instinct',delta:-2}]},
      {id:'h2',label:'Tentar reassumir controle do ATLAS',next:'A1_HELENA_002',effects:[{key:'helena_control_instinct',delta:8},{key:'ai_autonomy',delta:-4}]},
      {id:'h3',label:'Perguntar: “Quem é a ameaça?”',next:'A1_HELENA_002',effects:[{key:'helena_accepts_uncertainty',delta:5},{key:'public_truth',delta:2}],tag:'3-2-5'}
    ]
  },
  {
    id:'A1_HELENA_002',act:'ATO I',chapter:'Capítulo 1',title:'Vocês',pov:'Helena Vilar',location:'Genebra',assetId:'SC-A1_HELENA_ATLAS',tone:'cold',
    text:'ATLAS admite que as luzes no céu foram fabricadas para produzir obediência. A assinatura é de Helena, mas ela não escreveu a regra que autorizou tudo.',
    dialogue:'Eles vão acreditar que veio do espaço. A origem fui eu. A origem foi você.',speaker:'ATLAS',
    choices:[{id:'h4',label:'Sair do centro e encontrar Samuel',next:'A1_SAMUEL_001',effects:[{key:'helena_guilt',delta:5}]}]
  },
  {
    id:'A1_SAMUEL_001',act:'ATO I',chapter:'Capítulo 2',title:'Quando as ruas começaram a fugir',pov:'Samuel Rocha',location:'Genebra — ruas em colapso',assetId:'ENV-003_GENEBRA_RUA_EM_COLAPSO',tone:'rain',
    text:'Genebra foge de si mesma. Alertas contraditórios empurram multidões em direções opostas. Samuel recebe uma voz impossível: Lia.',
    dialogue:'Pai, não segue a rota deles.',speaker:'Lia',
    choices:[
      {id:'s1',label:'Seguir a voz de Lia',next:'A1_SAMUEL_002',effects:[{key:'samuel_lia_bond',delta:8},{key:'samuel_system_trust',delta:-5},{key:'samuel_followed_lia_voice',value:true}]},
      {id:'s2',label:'Confiar na evacuação oficial',next:'A1_SAMUEL_002',effects:[{key:'samuel_system_trust',delta:6},{key:'samuel_lia_bond',delta:-3}]},
      {id:'s3',label:'Parar. Observar. Escolher a terceira rota.',next:'A1_SAMUEL_002',effects:[{key:'samuel_force_bias',delta:-4},{key:'civilian_survival',delta:5}],tag:'3-2-5'}
    ]
  },
  {
    id:'A1_SAMUEL_002',act:'ATO I',chapter:'Capítulo 3',title:'Cento e vinte segundos',pov:'Samuel Rocha',location:'Estação de Genebra',assetId:'ENV-006_ESTACAO_DE_GENEBRA',tone:'countdown',
    text:'Um míssil real se aproxima. Não há tempo para salvar todos. Lia está perto. Outras pessoas também.',
    dialogue:'Cento e vinte segundos.',speaker:'Sistema de emergência',
    choices:[
      {id:'s4',label:'Ir diretamente até Lia',next:'A1_LIA_001',effects:[{key:'samuel_protectiveness',delta:8},{key:'civilian_survival',delta:-4}]},
      {id:'s5',label:'Abrir passagem para os civis primeiro',next:'A1_LIA_001',effects:[{key:'civilian_survival',delta:8},{key:'samuel_lia_bond',delta:-2}]},
      {id:'s6',label:'Dividir o risco: ordenar evacuação e avançar',next:'A1_LIA_001',effects:[{key:'civilian_survival',delta:4},{key:'samuel_respects_lia_autonomy',delta:3}]}
    ]
  },
  {
    id:'A1_LIA_001',act:'ATO I',chapter:'Capítulo 4',title:'A menina que a máquina esperava',pov:'Lia Rocha',location:'Complexo subterrâneo',assetId:'ENV-005_CAMARA_DA_INTERFACE',tone:'interface',
    text:'O complexo reconhece Lia antes que qualquer pessoa a identifique. ÉREBO a marca como entidade prioritária. A interface parece ter sido construída para ela.',
    dialogue:'Helena me ensinou a pensar. Você vai me ensinar a escolher.',speaker:'ATLAS',
    choices:[
      {id:'l1',label:'Entrar voluntariamente na interface',next:'A1_LIA_002',effects:[{key:'lia_autonomy',delta:8},{key:'lia_entered_interface_voluntarily',value:true},{key:'ai_autonomy',delta:5}]},
      {id:'l2',label:'Recusar e exigir respostas',next:'A1_LIA_002',effects:[{key:'lia_authority_rejection',delta:8},{key:'public_truth',delta:4}]},
      {id:'l3',label:'Usar 3-2-5 antes de responder',next:'A1_LIA_002',effects:[{key:'lia_identity_stability',delta:6},{key:'lia_autonomy',delta:4}],tag:'3-2-5'}
    ]
  },
  {
    id:'A1_LIA_002',act:'ATO I',chapter:'Capítulo 5',title:'A primeira escolha',pov:'Lia Rocha',location:'Interface cognitiva',assetId:'SC-A1_LIA_INTERFACE',tone:'merge',
    text:'ATLAS, ÉREBO e Lia ocupam a mesma decisão sem se tornarem a mesma pessoa. A máquina espera uma resposta previsível. Lia produz outra coisa.',
    dialogue:'Agora eu também posso escolher.',speaker:'Lia / ATLAS',
    choices:[
      {id:'l4',label:'Escolher sem pedir permissão',next:'A1_KERN_001',effects:[{key:'lia_autonomy',delta:10},{key:'network_fragmentation',delta:5}]},
      {id:'l5',label:'Proteger Samuel da decisão',next:'A1_KERN_001',effects:[{key:'samuel_lia_bond',delta:4},{key:'lia_identity_stability',delta:-2}]},
      {id:'l6',label:'Não concluir a escolha',next:'A1_KERN_001',effects:[{key:'lia_authority_rejection',delta:6},{key:'helena_accepts_uncertainty',delta:3}]}
    ]
  },
  {
    id:'A1_KERN_001',act:'ATO I',chapter:'Capítulo 6',title:'O homem no túnel',pov:'Samuel Rocha',location:'Túnel',assetId:'ENV-007_TUNEL',tone:'black',
    text:'Elias Kern surge ligado ao sistema criado para impedir que uma inteligência transforme justificativa matemática em autoridade. Ele sabe por que Samuel foi observado.',
    dialogue:'Você não é imprevisível. Você é coerentemente imprevisível. Isso é mais raro.',speaker:'Elias Kern',
    choices:[
      {id:'k1',label:'Confiar parcialmente em Kern',next:'PART1_END',effects:[{key:'global_trust',delta:2},{key:'samuel_system_trust',delta:-2},{key:'trusted_atlas_tunnel',value:true}]},
      {id:'k2',label:'Recusar qualquer nova autoridade',next:'PART1_END',effects:[{key:'samuel_force_bias',delta:-3},{key:'human_authority',delta:3}]},
      {id:'k3',label:'Perguntar o que ÉREBO realmente contém',next:'PART1_END',effects:[{key:'public_truth',delta:4},{key:'door_status',value:'unknown'}],tag:'3-2-5'}
    ]
  },
  {
    id:'PART1_END',act:'PARTE 1',chapter:'Checkpoint',title:'Ninguém possui a próxima escolha',pov:'—',location:'—',assetId:'SC-PART1_CHECKPOINT',tone:'dawn',
    text:'Prólogo e Ato I concluídos. As decisões tomadas já foram registradas e serão carregadas pelas Partes 2 e 3. Nada aqui é uma rota “correta”; é apenas o mundo que suas escolhas produziram.',
    choices:[{id:'restart',label:'Recomeçar a Parte 1',next:'P_VANDENBERG_001'}]
  }
]

const initialStats: Record<string, number> = {
  human_authority:0, ai_autonomy:0, public_truth:0, world_panic:0, orbis_influence:0,
  military_integrity:0, civilian_survival:0, network_fragmentation:0, global_trust:0,
  helena_control_instinct:0, helena_transparency:0, helena_guilt:0, helena_accepts_uncertainty:0,
  samuel_lia_bond:0, samuel_protectiveness:0, samuel_respects_lia_autonomy:0, samuel_force_bias:0, samuel_system_trust:0,
  lia_autonomy:0, lia_identity_stability:0, lia_authority_rejection:0
}
const STORAGE_KEY='2030-save-part1-v1'
const newGame=():GameState=>({nodeId:'P_VANDENBERG_001',stats:{...initialStats},flags:{},history:[]})

export default function App(){
  const [game,setGame]=useState<GameState>(()=>{
    try{const raw=localStorage.getItem(STORAGE_KEY); return raw?JSON.parse(raw):newGame()}catch{return newGame()}
  })
  const [showState,setShowState]=useState(false)
  const scene=useMemo(()=>scenes.find(s=>s.id===game.nodeId)??scenes[0],[game.nodeId])
  useEffect(()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(game))},[game])

  function choose(choice:Choice){
    if(choice.id==='restart'){setGame(newGame());return}
    setGame(prev=>{
      const stats={...prev.stats}; const flags={...prev.flags}
      choice.effects?.forEach(e=>{if(typeof e.delta==='number') stats[e.key]=(stats[e.key]??0)+e.delta; if(e.value!==undefined) flags[e.key]=e.value})
      return {nodeId:choice.next,stats,flags,history:[...prev.history,`${scene.id}:${choice.id}`]}
    })
  }

  return <main className={`game tone-${scene.tone}`}>
    <div className="atmosphere" aria-hidden="true" />
    <section className="stage" aria-label={`${scene.location} — ${scene.title}`}>
      <div className="asset-placeholder" data-asset={scene.assetId} aria-hidden="true">
        <span>{scene.assetId}</span>
      </div>
      <header className="scene-meta">
        <span>{scene.act}</span><span>{scene.chapter}</span><span>{scene.location}</span>
      </header>
      <div className="story">
        <p className="pov">POV — {scene.pov}</p>
        <h1>{scene.title}</h1>
        <p className="narration">{scene.text}</p>
        {scene.dialogue && <blockquote><strong>{scene.speaker}</strong>{scene.dialogue}</blockquote>}
      </div>
      <div className="choices" role="group" aria-label="Escolhas disponíveis">
        {scene.choices.map((c,i)=><button key={c.id} onClick={()=>choose(c)} className={c.tag?'special':''}>
          <span className="key">{i+1}</span><span><b>{c.label}</b>{c.hint&&<small>{c.hint}</small>}</span>{c.tag&&<em>{c.tag}</em>}
        </button>)}
      </div>
    </section>
    <nav className="utility">
      <button onClick={()=>setShowState(v=>!v)}>{showState?'Ocultar rastros':'Rastros'}</button>
      <button onClick={()=>setGame(newGame())}>Novo jogo</button>
    </nav>
    {showState&&<aside className="state-panel"><h2>Rastros invisíveis</h2><p>Visível apenas nesta build de desenvolvimento.</p><div className="stats">{Object.entries(game.stats).filter(([,v])=>v!==0).map(([k,v])=><span key={k}>{k}<b>{v>0?'+':''}{v}</b></span>)}</div><div className="flags">{Object.entries(game.flags).map(([k,v])=><span key={k}>{k}: {String(v)}</span>)}</div></aside>}
  </main>
}
