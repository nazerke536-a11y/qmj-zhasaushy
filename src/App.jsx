import { useState, useRef } from "react";

// ─── LANGUAGE CONFIG ──────────────────────────────────────────────────────────
const LANGS = {
  kz: {
    label: "Қаз", fullLabel: "Қазақша",
    subjects: ["Қазақ тілі","Математика","Биология","Химия","Физика","История","Ағылшын тілі","Орыс тілі","Информатика","География"],
    grades: ["1","2","3","4","5","6","7","8","9","10","11"],
    planTitle: "ҚЫСҚА МЕРЗІМДІ ЖОСПАР",
    stageNames: ["Сабақтың басы / Жылыту","Алдын-ала оқыту / «Миға шабуыл»","Сабақтың ортасы / Презентация","Сабақтың соңы / Рефлексия"],
    stageTimes: ["3 мин","7 мин","30 мин","5 мин"],
    f: {
      langLabel:"Тіл", subjectLabel:"Пән",
      unit:"ҰМЖ бөлімі", lesson:"Сабақ №", teacher:"Мұғалімнің аты-жөні",
      date:"Күні", grade:"Сынып *", present:"Қатысушылар", absent:"Қатыспағандар",
      ltitle:"Сабақтың тақырыбы *", lobj:"Оқу мақсаттары",
      sobj:"Сабақтың мақсаттары", values:"Құндылықтарға байланыс",
      col1:"Кезеңдер / Уақыт", col2:"Мұғалімнің іс-әрекеті",
      col3:"Оқушының іс-әрекеті", col4:"Бағалау", col5:"Ресурстар",
      gen:"ЖИ арқылы жасау", wait:"ЖИ жоспар жасап жатыр…",
      plsWait:"Күте тұрыңыз, бұл 15-30 секунд алуы мүмкін",
      editMsg:"✅ ЖИ жоспарды жасады! Өзгертіп, Word жүктеңіз.",
      dl:"⬇ Word (.docx) жүктеу", dlDone:"✅ Word файлы жүктелді!",
      back:"← Артқа", newPlan:"+ Жаңа жоспар",
      editDl:"✏ Өзгертіп жүктеу", fillReq:"Сынып пен тақырыпты толтырыңыз!",
      done:"Дайын! 🎉", doneMsg:"Жоспар Word форматында жүктелді.",
      aiWillGen:"ЖИ автоматты жасайды:",
      step1:"Толтыру", step2:"Өзгерту", step3:"Жүктеу",
      hdrSub:"Өрістерді толтыр → ЖИ жоспар жасайды",
      errorMsg:"Қате: ",
      bookPages:"📚 Оқулық беттері",
      bookHint:"Оқулық беттерін жүктесеңіз, ЖИ оларды талдап, нақты сабақ жоспарын жасайды",
      bookOptional:"(міндетті емес, көп дегенде 5 сурет)",
      uploadImg:"+ Сурет жүктеу", uploadCamera:"📷 Камерадан",
      noImages:"Оқулық беттері әлі жүктелмеді",
      removeImg:"Жою", imgsCount:"сурет жүктелді",
      tooManyImgs:"Көп дегенде 5 сурет жүктеуге болады!",
      tooLargeImg:"Сурет тым үлкен (10МБ-дан көп):",
      processingImg:"Сурет өңделуде…",
      withImagesNote:"📚 ЖИ оқулық беттерін талдайды",
    }
  },
  ru: {
    label: "Рус", fullLabel: "Русский",
    subjects: ["Казахский язык","Русский язык","Математика","Биология","Химия","Физика","История","Английский язык","Информатика","География"],
    grades: ["1","2","3","4","5","6","7","8","9","10","11"],
    planTitle: "КРАТКОСРОЧНЫЙ ПЛАН",
    stageNames: ["Начало урока / Разминка","Предварительное изучение / Мозговой штурм","Середина урока / Презентация","Конец урока / Рефлексия"],
    stageTimes: ["3 мин","7 мин","30 мин","5 мин"],
    f: {
      langLabel:"Язык", subjectLabel:"Предмет",
      unit:"Раздел долгосрочного плана", lesson:"Урок №", teacher:"ФИО учителя",
      date:"Дата", grade:"Класс *", present:"Присутствуют", absent:"Отсутствуют",
      ltitle:"Тема урока *", lobj:"Цели обучения",
      sobj:"Цели урока", values:"Связь с ценностями",
      col1:"Этапы / Время", col2:"Действия учителя",
      col3:"Действия учеников", col4:"Оценивание", col5:"Ресурсы",
      gen:"Создать с помощью ИИ", wait:"ИИ создаёт план урока…",
      plsWait:"Пожалуйста, подождите 15–30 секунд",
      editMsg:"✅ ИИ создал план! Отредактируйте и скачайте Word.",
      dl:"⬇ Скачать Word (.docx)", dlDone:"✅ Файл Word скачан!",
      back:"← Назад", newPlan:"+ Новый план",
      editDl:"✏ Редактировать и скачать", fillReq:"Заполните класс и тему урока!",
      done:"Готово! 🎉", doneMsg:"План скачан в формате Word.",
      aiWillGen:"ИИ создаст автоматически:",
      step1:"Заполнить", step2:"Изменить", step3:"Скачать",
      hdrSub:"Заполните поля → ИИ создаст план урока",
      errorMsg:"Ошибка: ",
      bookPages:"📚 Страницы учебника",
      bookHint:"Загрузите страницы учебника — ИИ проанализирует их и составит точный план урока",
      bookOptional:"(необязательно, максимум 5 фото)",
      uploadImg:"+ Загрузить фото", uploadCamera:"📷 С камеры",
      noImages:"Страницы учебника ещё не загружены",
      removeImg:"Удалить", imgsCount:"фото загружено",
      tooManyImgs:"Можно загрузить максимум 5 фото!",
      tooLargeImg:"Файл слишком большой (более 10МБ):",
      processingImg:"Обработка изображения…",
      withImagesNote:"📚 ИИ проанализирует страницы учебника",
    }
  },
  en: {
    label: "Eng", fullLabel: "English",
    subjects: ["English","Mathematics","Biology","Chemistry","Physics","History","Kazakh","Russian","Computer Science","Geography"],
    grades: ["1","2","3","4","5","6","7","8","9","10","11"],
    planTitle: "SHORT-TERM PLAN",
    stageNames: ["Beginning / Warming-up","Pre-learning / Brainstorming","Middle of lesson / Presentation","End of lesson / Reflection"],
    stageTimes: ["3 min","7 min","30 min","5 min"],
    f: {
      langLabel:"Language", subjectLabel:"Subject",
      unit:"Unit of long-term plan", lesson:"Lesson #", teacher:"Teacher name",
      date:"Date", grade:"Grade *", present:"Present", absent:"Absent",
      ltitle:"Lesson title *", lobj:"Learning objectives",
      sobj:"Lesson objectives", values:"Value links",
      col1:"Stages / Time", col2:"Teacher's actions",
      col3:"Students' actions", col4:"Assessment", col5:"Resources",
      gen:"Generate with AI", wait:"AI is generating the plan…",
      plsWait:"Please wait 15–30 seconds",
      editMsg:"✅ AI generated the plan! Edit and download Word.",
      dl:"⬇ Download Word (.docx)", dlDone:"✅ Word file downloaded!",
      back:"← Back", newPlan:"+ New plan",
      editDl:"✏ Edit & re-download", fillReq:"Please fill in Grade and Lesson title!",
      done:"Done! 🎉", doneMsg:"Lesson plan downloaded as Word document.",
      aiWillGen:"AI will generate automatically:",
      step1:"Fill in", step2:"Edit", step3:"Download",
      hdrSub:"Fill in fields → AI generates the lesson plan",
      errorMsg:"Error: ",
      bookPages:"📚 Textbook pages",
      bookHint:"Upload textbook pages — AI will analyze them and craft an accurate lesson plan",
      bookOptional:"(optional, max 5 images)",
      uploadImg:"+ Upload image", uploadCamera:"📷 From camera",
      noImages:"No textbook pages uploaded yet",
      removeImg:"Remove", imgsCount:"images uploaded",
      tooManyImgs:"Maximum 5 images allowed!",
      tooLargeImg:"File too large (more than 10MB):",
      processingImg:"Processing image…",
      withImagesNote:"📚 AI will analyze textbook pages",
    }
  }
};

// ─── IMAGE PROCESSING ─────────────────────────────────────────────────────────
async function resizeImageToBase64(file, maxWidth = 1600) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve({
          data: dataUrl.split(",")[1],
          mediaType: "image/jpeg",
          name: file.name,
          preview: dataUrl,
          sizeKB: Math.round((dataUrl.length * 3) / 4 / 1024),
        });
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

// ─── AI CALL ──────────────────────────────────────────────────────────────────
// ✅ Google Gemini API қолданады — тегін деңгей (free tier), несие картасы керек емес
// Сұраныс /api/generate-ге жіберіледі (Vercel serverless функциясы), API кілт қауіпсіз
async function callAI(lang, subject, info, images) {
  const l = LANGS[lang];
  const hasImages = images && images.length > 0;

  const imgNote = {
    kz: hasImages ? `\nПайдаланушы ${images.length} оқулық бетінің суретін жүктеді. Сабақ жоспарын ОСЫ оқулық беттерінің мазмұнына негізделіп жасаңыз. Суреттерден тақырып, лексика, грамматика, тапсырмалар, мысалдарды талдап алыңыз. Мұғалімнің іс-әрекеттерінде НАҚТЫ оқулық тапсырмаларына сілтеме жасаңыз (мысалы: «1-тапсырманы оқу», «2-жаттығуды орындау»).` : "",
    ru: hasImages ? `\nПользователь загрузил ${images.length} фото страниц учебника. Создайте план урока на основе СОДЕРЖАНИЯ этих страниц. Извлеките из изображений тему, лексику, грамматику, задания, примеры. В действиях учителя ссылайтесь на КОНКРЕТНЫЕ задания учебника (например: «прочитать упр. 1», «выполнить задание 2»).` : "",
    en: hasImages ? `\nUser uploaded ${images.length} textbook page image(s). Create the lesson plan based on the CONTENT of these pages. Extract topics, vocabulary, grammar, tasks, examples from the images. In teacher actions, reference SPECIFIC textbook tasks (e.g. "read task 1", "complete exercise 2").` : "",
  };

  const sysPrompts = {
    kz: `Сіз Қазақстан мектептері үшін ҚМЖ жасаушы сарапшысыз. Толық сабақ жоспарын қазақ тілінде жасаңыз. ТЕК дұрыс JSON қайтарыңыз (markdown жоқ). JSON құрылымы:
{"lessonObj":"string (барлық/көпшілік/кейбір оқушылар үшін 3 мақсат)","valueLinks":"string (үтірмен бөлінген 3 құндылық)","stages":[{"stageName":"string","time":"string","teacherAction":"string (нақты, кемінде 5 іс-әрекет)","studentAction":"string (нақты, кемінде 4 іс-әрекет)","assessment":"string","resources":"string"}]}
Пән: "${subject}", Сынып: ${info.grade}, Тақырып: "${info.lessonTitle}"${info.learningObj ? ', Оқу мақсаттары: ' + info.learningObj : ''}. Кезеңдер: ${l.stageNames.map((s,i)=>s+' ('+l.stageTimes[i]+')').join(', ')}. Мазмұн нақты, детальды болсын.${imgNote.kz}`,
    ru: `Вы эксперт по составлению КСП для школ Казахстана. Составьте полный план урока на русском языке. Верните ТОЛЬКО валидный JSON (без markdown). Структура JSON:
{"lessonObj":"string (3 цели: все/большинство/некоторые ученики)","valueLinks":"string (3 ценности через запятую)","stages":[{"stageName":"string","time":"string","teacherAction":"string (конкретно, минимум 5 действий)","studentAction":"string (конкретно, минимум 4 действия)","assessment":"string","resources":"string"}]}
Предмет: "${subject}", Класс: ${info.grade}, Тема: "${info.lessonTitle}"${info.learningObj ? ', Цели обучения: ' + info.learningObj : ''}. Этапы: ${l.stageNames.map((s,i)=>s+' ('+l.stageTimes[i]+')').join(', ')}. Содержание должно быть конкретным и детальным.${imgNote.ru}`,
    en: `You are an expert lesson plan writer for Kazakhstan schools. Generate a complete lesson plan in English. Return ONLY valid JSON (no markdown). JSON structure:
{"lessonObj":"string (3 differentiated objectives: All/Most/Some learners)","valueLinks":"string (3 values comma-separated)","stages":[{"stageName":"string","time":"string","teacherAction":"string (specific, minimum 5 actions)","studentAction":"string (specific, minimum 4 actions)","assessment":"string","resources":"string"}]}
Subject: "${subject}", Grade: ${info.grade}, Topic: "${info.lessonTitle}"${info.learningObj ? ', Learning objectives: ' + info.learningObj : ''}. Stages: ${l.stageNames.map((s,i)=>s+' ('+l.stageTimes[i]+')').join(', ')}. Make content specific and detailed.${imgNote.en}`
  };

  // Vercel proxy-ге қарапайым формат жібереміз; ол өзі Gemini-ге бейімдейді
  const resp = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system: sysPrompts[lang],
      userText: hasImages
        ? "Analyze these textbook pages and generate the lesson plan JSON now."
        : "Generate the lesson plan JSON now.",
      images: hasImages
        ? images.map((img) => ({ data: img.data, mediaType: img.mediaType }))
        : [],
    }),
  });

  if (!resp.ok) {
    let errMsg = "API " + resp.status;
    try {
      const errJson = await resp.json();
      if (errJson?.error?.message) errMsg += " — " + errJson.error.message;
    } catch {}
    throw new Error(errMsg);
  }
  const data = await resp.json();
  const text = data.text || "";
  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);
  if (parsed.stages) {
    parsed.stages.forEach((s, i) => {
      s.stageName = l.stageNames[i] || s.stageName;
      s.time = l.stageTimes[i] || s.time;
    });
  }
  return parsed;
}

// ─── DOCX BUILDER ─────────────────────────────────────────────────────────────
function buildAndDownloadDocx(lang, subject, info, generated) {
  const l = LANGS[lang];
  const f = l.f;
  const esc = s => (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br/>");

  const stageRows = (generated.stages||[]).map(s => `
    <tr>
      <td class="stage-cell">
        <p class="stage-name">${esc(s.stageName)}</p>
        <p class="stage-time">${esc(s.time)}</p>
      </td>
      <td class="content-cell">${esc(s.teacherAction)}</td>
      <td class="content-cell">${esc(s.studentAction)}</td>
      <td class="content-cell">${esc(s.assessment)}</td>
      <td class="content-cell resources-cell">${esc(s.resources)}</td>
    </tr>`).join("");

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4 landscape; margin: 1.2cm 1.0cm; mso-page-orientation: landscape; }
  body { font-family: "Times New Roman", serif; font-size: 10pt; color: #000; margin: 0; padding: 0; }
  .doc-title { text-align: center; font-size: 14pt; font-weight: bold; margin: 0 0 10px 0; letter-spacing: 1px; }
  .meta-table { border-collapse: collapse; width: 100%; margin-bottom: 10px; font-size: 10pt; }
  .meta-table td { border: 1px solid #000; padding: 4px 8px; vertical-align: top; }
  .meta-label { font-weight: bold; width: 35%; background: #dce6f1; }
  .plan-table { border-collapse: collapse; width: 100%; font-size: 9.5pt; }
  .plan-table th { border: 1.5px solid #000; padding: 5px 6px; background: #dce6f1; font-weight: bold; text-align: center; vertical-align: middle; font-size: 10pt; }
  .plan-table td { border: 1px solid #000; padding: 5px 6px; vertical-align: top; line-height: 1.4; }
  .stage-cell { width: 14%; background: #f2f7fb; }
  .stage-name { font-weight: bold; font-size: 9.5pt; margin: 0 0 4px 0; }
  .stage-time { font-style: italic; color: #444; font-size: 9pt; margin: 0; }
  .content-cell { width: 21%; }
  .resources-cell { width: 12%; }
  br { mso-data-placement: same-cell; }
</style>
<!--[if gte mso 9]>
<xml><w:WordDocument><w:View>Print</w:View><w:Zoom>90</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument>
<o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
<![endif]-->
</head>
<body>
<p class="doc-title">${l.planTitle}</p>
<table class="meta-table">
  <tr><td class="meta-label">${f.unit}:</td><td colspan="3">${esc(info.unit)}</td><td class="meta-label">${f.lesson}:</td><td>${esc(info.lessonNum)}</td></tr>
  <tr><td class="meta-label">${f.teacher}:</td><td colspan="3">${esc(info.teacher)}</td><td class="meta-label">${f.date}:</td><td>${esc(info.date)}</td></tr>
  <tr><td class="meta-label">${f.grade}:</td><td>${esc(info.grade)}</td><td class="meta-label">${f.present}:</td><td>${esc(info.present)}</td><td class="meta-label">${f.absent}:</td><td>${esc(info.absent)}</td></tr>
  <tr><td class="meta-label">${f.ltitle.replace(" *","")}:</td><td colspan="5">${esc(info.lessonTitle)}</td></tr>
  <tr><td class="meta-label">${f.lobj}:</td><td colspan="5">${esc(info.learningObj)}</td></tr>
  <tr><td class="meta-label">${f.sobj}:</td><td colspan="5">${esc(generated.lessonObj)}</td></tr>
  <tr><td class="meta-label">${f.values}:</td><td colspan="5">${esc(generated.valueLinks)}</td></tr>
</table>
<table class="plan-table">
  <thead><tr>
    <th style="width:14%">${f.col1}</th><th style="width:22%">${f.col2}</th>
    <th style="width:22%">${f.col3}</th><th style="width:18%">${f.col4}</th>
    <th style="width:12%">${f.col5}</th>
  </tr></thead>
  <tbody>${stageRows}</tbody>
</table>
</body></html>`;

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + html], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safe = (info.lessonTitle || "sabaq").replace(/[^а-яёА-ЯЁa-zA-ZәіңғүұқөһӘІҢҒҮҰҚӨҺ0-9]/g, "_").slice(0,30);
  a.download = `QMJ_${lang}_${info.grade}sn_${safe}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  app: { minHeight:"100vh", background:"#f0f4f8", fontFamily:"'Segoe UI',system-ui,sans-serif", paddingBottom:80 },
  header: { background:"linear-gradient(135deg,#0d3b6e,#1565c0)", padding:"12px 16px 10px", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(0,0,0,0.25)" },
  h1: { color:"#fff", margin:"0 0 2px", fontSize:17, fontWeight:700, letterSpacing:0.3 },
  hSub: { color:"#90caf9", margin:"0 0 10px", fontSize:10.5 },
  steps: { display:"flex", gap:5 },
  stepActive: { flex:1, padding:"6px 3px", borderRadius:8, textAlign:"center", fontSize:10, fontWeight:700, background:"#fff", color:"#0d3b6e", cursor:"pointer", border:"none" },
  stepDone: { flex:1, padding:"6px 3px", borderRadius:8, textAlign:"center", fontSize:10, fontWeight:600, background:"rgba(255,255,255,0.28)", color:"#fff", cursor:"pointer", border:"none" },
  stepFuture: { flex:1, padding:"6px 3px", borderRadius:8, textAlign:"center", fontSize:10, fontWeight:500, background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.45)", border:"none" },
  content: { padding:"14px 14px 0" },
  card: { background:"#fff", borderRadius:14, padding:14, marginBottom:12, boxShadow:"0 2px 10px rgba(0,0,0,0.07)", border:"1px solid #e3eaf3" },
  cardTitle: { fontSize:13, fontWeight:700, color:"#0d3b6e", marginBottom:12, marginTop:0 },
  field: { marginBottom:10 },
  label: { display:"block", fontSize:11, fontWeight:600, color:"#1565c0", marginBottom:4 },
  input: { width:"100%", padding:"8px 10px", border:"1.5px solid #c5d8f0", borderRadius:8, fontSize:12.5, color:"#1a2840", outline:"none", boxSizing:"border-box", fontFamily:"inherit", background:"#fff" },
  inputHL: { width:"100%", padding:"8px 10px", border:"1.5px solid #f9a825", borderRadius:8, fontSize:12.5, color:"#1a2840", outline:"none", boxSizing:"border-box", fontFamily:"inherit", background:"#fffde7" },
  select: { width:"100%", padding:"8px 10px", border:"1.5px solid #f9a825", borderRadius:8, fontSize:12.5, color:"#1a2840", outline:"none", boxSizing:"border-box", fontFamily:"inherit", background:"#fffde7", cursor:"pointer" },
  grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
  langRow: { display:"flex", gap:6, marginBottom:12 },
  langBtn: (active) => ({ flex:1, padding:"7px 4px", borderRadius:8, textAlign:"center", fontSize:12, fontWeight:600, cursor:"pointer", border: active ? "none" : "1px solid #c5d8f0", background: active ? "#0d3b6e" : "#f0f6ff", color: active ? "#fff" : "#1565c0", transition:"all 0.15s" }),
  subjectGrid: { display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:6, marginBottom:10 },
  subjBtn: (active) => ({ padding:"7px 4px", borderRadius:8, textAlign:"center", fontSize:11, fontWeight:600, cursor:"pointer", border: active ? "none" : "1px solid #c5d8f0", background: active ? "#1565c0" : "#f0f6ff", color: active ? "#fff" : "#1565c0", lineHeight:1.3, transition:"all 0.15s" }),
  aiPreview: { background:"#f0f6ff", border:"1.5px dashed #90caf9", borderRadius:10, padding:"10px 12px", marginTop:6 },
  btnPrimary: { width:"100%", padding:"13px 0", background:"linear-gradient(135deg,#0d3b6e,#1565c0)", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer", marginTop:4, boxShadow:"0 3px 14px rgba(21,101,192,0.35)", letterSpacing:0.2 },
  btnSecondary: { width:"100%", padding:"11px 0", background:"#fff", color:"#0d3b6e", border:"2px solid #1565c0", borderRadius:12, fontSize:13, fontWeight:700, cursor:"pointer", marginTop:8 },
  btnGreen: { width:"100%", padding:"13px 0", background:"linear-gradient(135deg,#1b5e20,#2e7d32)", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer", marginTop:4, boxShadow:"0 3px 14px rgba(46,125,50,0.35)" },
  loadBox: { textAlign:"center", padding:"36px 20px" },
  stageCard: { background:"#fff", borderRadius:12, padding:14, marginBottom:10, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", border:"1px solid #e3eaf3" },
  stageBadge: { background:"#e8f0fe", borderRadius:7, padding:"5px 10px", marginBottom:10, fontSize:11, color:"#1565c0", fontWeight:600 },
  infoBanner: { background:"#e8f5e9", border:"1px solid #a5d6a7", borderRadius:10, padding:"10px 14px", marginBottom:12, fontSize:12, color:"#1b5e20", fontWeight:600 },
  errBanner: { background:"#ffebee", border:"1px solid #ef9a9a", borderRadius:10, padding:"10px 14px", marginBottom:12, fontSize:12, color:"#b71c1c" },
  successBox: { background:"#fff", borderRadius:18, padding:"28px 20px", textAlign:"center", boxShadow:"0 4px 20px rgba(21,101,192,0.12)", border:"1px solid #e3eaf3" },
  footer: { position:"fixed", bottom:0, left:0, right:0, background:"rgba(255,255,255,0.97)", borderTop:"1px solid #dce6f4", padding:"6px 10px", textAlign:"center", fontSize:9, color:"#78909c", backdropFilter:"blur(8px)" },
  textarea: { width:"100%", padding:"8px 10px", border:"1.5px solid #c5d8f0", borderRadius:8, fontSize:12, color:"#1a2840", outline:"none", boxSizing:"border-box", fontFamily:"inherit", resize:"vertical", lineHeight:1.5 },
  bookCard: { background:"linear-gradient(135deg,#fff8e1,#fff3e0)", borderRadius:14, padding:14, marginBottom:12, boxShadow:"0 2px 10px rgba(0,0,0,0.07)", border:"1.5px solid #ffd54f" },
  bookHint: { fontSize:11, color:"#6d4c00", lineHeight:1.5, marginBottom:10, marginTop:0 },
  uploadRow: { display:"flex", gap:8, marginBottom:10 },
  uploadBtn: { flex:1, padding:"10px 8px", background:"#fff", color:"#bf6c00", border:"2px dashed #f9a825", borderRadius:10, fontSize:12, fontWeight:700, cursor:"pointer", textAlign:"center" },
  uploadBtnDisabled: { flex:1, padding:"10px 8px", background:"#f5f5f5", color:"#bbb", border:"2px dashed #ddd", borderRadius:10, fontSize:12, fontWeight:700, cursor:"not-allowed", textAlign:"center" },
  thumbGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:8 },
  thumb: { position:"relative", width:"100%", paddingBottom:"100%", borderRadius:8, overflow:"hidden", border:"2px solid #f9a825", background:"#fff" },
  thumbImg: { position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" },
  thumbRemove: { position:"absolute", top:3, right:3, width:24, height:24, borderRadius:"50%", background:"rgba(198,40,40,0.95)", color:"#fff", border:"none", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0, lineHeight:1, boxShadow:"0 1px 4px rgba(0,0,0,0.3)" },
  thumbBadge: { position:"absolute", bottom:3, left:3, background:"rgba(0,0,0,0.65)", color:"#fff", fontSize:9, padding:"1px 5px", borderRadius:4, fontWeight:600 },
  emptyImgs: { textAlign:"center", padding:"18px 10px", color:"#a98a3a", fontSize:11, fontStyle:"italic", background:"rgba(255,255,255,0.5)", borderRadius:8, border:"1px dashed #ffd54f" },
  imgCounter: { fontSize:11, fontWeight:700, color:"#bf6c00", textAlign:"center", marginTop:4 },
  withImgsBadge: { background:"#fff8e1", border:"1px solid #ffd54f", borderRadius:8, padding:"6px 10px", marginTop:6, fontSize:11, color:"#6d4c00", fontWeight:700, textAlign:"center" },
};

const MAX_IMAGES = 5;
const MAX_FILE_SIZE_MB = 10;

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function QMJApp() {
  const [lang, setLangState] = useState("kz");
  const [subject, setSubject] = useState("Қазақ тілі");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(null);
  const [dlDone, setDlDone] = useState(false);
  const [info, setInfo] = useState({ unit:"", lessonNum:"", teacher:"", date:"", grade:"", present:"", absent:"", lessonTitle:"", learningObj:"" });
  const [images, setImages] = useState([]);
  const [processingImg, setProcessingImg] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const l = LANGS[lang];
  const f = l.f;
  const setI = (k, v) => setInfo(p => ({ ...p, [k]: v }));

  const changeLang = (nl) => {
    setLangState(nl);
    setSubject(LANGS[nl].subjects[0]);
  };

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    setError("");
    if (images.length + files.length > MAX_IMAGES) { setError(f.tooManyImgs); return; }
    setProcessingImg(true);
    const newImgs = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(f.tooLargeImg + " " + file.name); continue;
      }
      try { newImgs.push(await resizeImageToBase64(file)); }
      catch (e) { console.warn("Image processing failed:", e); }
    }
    setImages(prev => [...prev, ...newImgs]);
    setProcessingImg(false);
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleGenerate = async () => {
    if (!info.grade || !info.lessonTitle) { setError(f.fillReq); return; }
    setError(""); setLoading(true); setGenerated(null);
    try {
      const result = await callAI(lang, subject, info, images);
      setGenerated(result); setStep(2);
    } catch (e) { setError(f.errorMsg + e.message); }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!generated) return;
    buildAndDownloadDocx(lang, subject, info, generated);
    setDlDone(true); setStep(3);
  };

  const updateGenField = (field, val) => setGenerated(p => ({ ...p, [field]: val }));
  const updateStage = (i, field, val) => setGenerated(p => {
    const stages = [...p.stages];
    stages[i] = { ...stages[i], [field]: val };
    return { ...p, stages };
  });

  const resetAll = () => {
    setStep(1); setGenerated(null); setDlDone(false); setError(""); setImages([]);
    setInfo({ unit:"", lessonNum:"", teacher:"", date:"", grade:"", present:"", absent:"", lessonTitle:"", learningObj:"" });
  };

  const stepStyle = (n) => n === step ? S.stepActive : step > n ? S.stepDone : S.stepFuture;
  const canAddMore = images.length < MAX_IMAGES;

  return (
    <div style={S.app}>
      <div style={S.header}>
        <h1 style={S.h1}>📄 ЖИ-ҚМЖ Жасаушы</h1>
        <p style={S.hSub}>{f.hdrSub}</p>
        <div style={S.steps}>
          {[f.step1, f.step2, f.step3].map((label, i) => (
            <button key={i} style={stepStyle(i+1)}
              onClick={() => { if (i+1 <= step || (i+1 === 2 && generated)) setStep(i+1); }}>
              {i+1}. {label}
            </button>
          ))}
        </div>
      </div>

      <div style={S.content}>
        {step === 1 && !loading && (
          <>
            {error && <div style={S.errBanner}>{error}</div>}
            <div style={S.card}>
              <div style={{ ...S.field, marginBottom:12 }}>
                <label style={S.label}>{f.langLabel}</label>
                <div style={S.langRow}>
                  {Object.keys(LANGS).map(lk => (
                    <button key={lk} style={S.langBtn(lang===lk)} onClick={() => changeLang(lk)}>
                      {LANGS[lk].fullLabel}
                    </button>
                  ))}
                </div>
              </div>
              <div style={S.field}>
                <label style={S.label}>{f.subjectLabel}</label>
                <div style={S.subjectGrid}>
                  {l.subjects.map(s => (
                    <button key={s} style={S.subjBtn(subject===s)} onClick={() => setSubject(s)}>{s}</button>
                  ))}
                </div>
              </div>
              <div style={S.grid2}>
                <div style={S.field}>
                  <label style={S.label}>{f.grade}</label>
                  <select style={S.select} value={info.grade} onChange={e => setI("grade", e.target.value)}>
                    <option value="">—</option>
                    {l.grades.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div style={S.field}>
                  <label style={S.label}>{f.lesson}</label>
                  <input style={S.input} value={info.lessonNum} onChange={e => setI("lessonNum", e.target.value)} placeholder="1"/>
                </div>
              </div>
              <div style={S.field}>
                <label style={S.label}>{f.teacher}</label>
                <input style={S.input} value={info.teacher} onChange={e => setI("teacher", e.target.value)}
                  placeholder={lang==="en"?"Full name":lang==="ru"?"ФИО":"Аты-жөні"}/>
              </div>
              <div style={S.grid2}>
                <div style={S.field}>
                  <label style={S.label}>{f.date}</label>
                  <input style={S.input} type="date" value={info.date} onChange={e => setI("date", e.target.value)}/>
                </div>
                <div style={S.field}>
                  <label style={S.label}>{f.unit}</label>
                  <input style={S.input} value={info.unit} onChange={e => setI("unit", e.target.value)}
                    placeholder={lang==="en"?"Unit":lang==="ru"?"Раздел":"Бөлім"}/>
                </div>
              </div>
              <div style={S.grid2}>
                <div style={S.field}>
                  <label style={S.label}>{f.present}</label>
                  <input style={S.inputHL} value={info.present} onChange={e => setI("present", e.target.value)} placeholder="0"/>
                </div>
                <div style={S.field}>
                  <label style={S.label}>{f.absent}</label>
                  <input style={S.inputHL} value={info.absent} onChange={e => setI("absent", e.target.value)} placeholder="0"/>
                </div>
              </div>
            </div>

            <div style={S.card}>
              <div style={S.field}>
                <label style={S.label}>{f.ltitle}</label>
                <input style={{ ...S.inputHL, fontSize:14 }} value={info.lessonTitle}
                  onChange={e => setI("lessonTitle", e.target.value)}
                  placeholder={lang==="en"?"e.g. Rooms in a house":lang==="ru"?"Напр. Комнаты в доме":"Мысалы: Үй бөлмелері"}/>
              </div>
              <div style={S.field}>
                <label style={S.label}>{f.lobj}</label>
                <textarea style={{ ...S.textarea, background:"#fffde7", border:"1.5px solid #f9a825" }}
                  rows={3} value={info.learningObj} onChange={e => setI("learningObj", e.target.value)}
                  placeholder={lang==="en"?"e.g. 3.L1 recognise key vocabulary...":lang==="ru"?"Напр. 3.Т1 распознавать слова...":"Мысалы: 3.Т1 сөздерді тану..."}/>
              </div>
            </div>

            <div style={S.bookCard}>
              <p style={{ ...S.cardTitle, color:"#bf6c00" }}>{f.bookPages}</p>
              <p style={S.bookHint}>
                {f.bookHint} <span style={{ color:"#a98a3a", fontWeight:600 }}>{f.bookOptional}</span>
              </p>
              <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display:"none" }}
                onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}/>
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display:"none" }}
                onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}/>
              <div style={S.uploadRow}>
                <button style={canAddMore ? S.uploadBtn : S.uploadBtnDisabled}
                  onClick={() => canAddMore && fileInputRef.current?.click()}
                  disabled={!canAddMore || processingImg}>{f.uploadImg}</button>
                <button style={canAddMore ? S.uploadBtn : S.uploadBtnDisabled}
                  onClick={() => canAddMore && cameraInputRef.current?.click()}
                  disabled={!canAddMore || processingImg}>{f.uploadCamera}</button>
              </div>
              {processingImg && (
                <div style={{ textAlign:"center", color:"#bf6c00", fontSize:11, fontWeight:600, padding:"6px 0" }}>⏳ {f.processingImg}</div>
              )}
              {images.length === 0 && !processingImg && (
                <div style={S.emptyImgs}>{f.noImages}</div>
              )}
              {images.length > 0 && (
                <>
                  <div style={S.thumbGrid}>
                    {images.map((img, i) => (
                      <div key={i} style={S.thumb}>
                        <img src={img.preview} alt={"page " + (i+1)} style={S.thumbImg}/>
                        <button style={S.thumbRemove} onClick={() => removeImage(i)} title={f.removeImg}>×</button>
                        <span style={S.thumbBadge}>{i+1}</span>
                      </div>
                    ))}
                  </div>
                  <div style={S.imgCounter}>{images.length} / {MAX_IMAGES} {f.imgsCount}</div>
                </>
              )}
            </div>

            <div style={S.card}>
              <div style={S.aiPreview}>
                <p style={{ fontSize:11, color:"#1565c0", fontWeight:700, marginBottom:5 }}>🤖 {f.aiWillGen}</p>
                {[f.sobj, f.values, lang==="en"?"4 lesson stages (Teacher, Students, Assessment, Resources)":lang==="ru"?"4 этапа урока (Учитель, Ученики, Оценивание, Ресурсы)":"4 сабақ кезеңі (Мұғалім, Оқушы, Бағалау, Ресурстар)"]
                  .map((item, i) => <div key={i} style={{ fontSize:11, color:"#5c7fa3", padding:"1px 0" }}>— {item}</div>)}
              </div>
              {images.length > 0 && (
                <div style={S.withImgsBadge}>{f.withImagesNote} ({images.length})</div>
              )}
            </div>

            <button style={S.btnPrimary} onClick={handleGenerate}>🤖 {f.gen}</button>
          </>
        )}

        {loading && (
          <div style={S.card}>
            <div style={S.loadBox}>
              <div style={{ fontSize:52, marginBottom:10 }}>{images.length > 0 ? "📚🤖" : "🤖"}</div>
              <p style={{ fontWeight:700, fontSize:15, color:"#1565c0", marginBottom:5 }}>{f.wait}</p>
              <p style={{ color:"#78909c", fontSize:12, marginBottom:18 }}>
                {images.length > 0
                  ? (lang==="en" ? `Analyzing ${images.length} textbook page(s)…`
                     : lang==="ru" ? `Анализ ${images.length} страниц учебника…`
                     : `${images.length} оқулық беті талдануда…`)
                  : f.plsWait}
              </p>
              <div style={{ display:"flex", justifyContent:"center", gap:7 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:10, height:10, background:"#1565c0", borderRadius:"50%",
                    animation:`pulse 1.2s ${i*0.2}s infinite ease-in-out` }}/>
                ))}
              </div>
              <style>{`@keyframes pulse{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1.1);opacity:1}}`}</style>
            </div>
          </div>
        )}

        {step === 2 && generated && !loading && (
          <>
            <div style={S.infoBanner}>{f.editMsg}</div>
            {error && <div style={S.errBanner}>{error}</div>}
            <div style={S.card}>
              <p style={S.cardTitle}>📌 {f.sobj}</p>
              <div style={S.field}>
                <label style={S.label}>{f.sobj}</label>
                <textarea style={S.textarea} rows={4} value={generated.lessonObj}
                  onChange={e => updateGenField("lessonObj", e.target.value)}/>
              </div>
              <div style={S.field}>
                <label style={S.label}>{f.values}</label>
                <input style={S.input} value={generated.valueLinks}
                  onChange={e => updateGenField("valueLinks", e.target.value)}/>
              </div>
            </div>
            {(generated.stages||[]).map((stage, i) => (
              <div key={i} style={S.stageCard}>
                <p style={S.cardTitle}>{i+1}. {(stage.stageName||"").split("/")[0].trim()}</p>
                <div style={S.stageBadge}>{stage.stageName} ({stage.time})</div>
                <div style={S.field}>
                  <label style={S.label}>{f.col2}</label>
                  <textarea style={S.textarea} rows={5} value={stage.teacherAction}
                    onChange={e => updateStage(i,"teacherAction",e.target.value)}/>
                </div>
                <div style={S.field}>
                  <label style={S.label}>{f.col3}</label>
                  <textarea style={S.textarea} rows={4} value={stage.studentAction}
                    onChange={e => updateStage(i,"studentAction",e.target.value)}/>
                </div>
                <div style={S.grid2}>
                  <div style={S.field}>
                    <label style={S.label}>{f.col4}</label>
                    <textarea style={S.textarea} rows={3} value={stage.assessment}
                      onChange={e => updateStage(i,"assessment",e.target.value)}/>
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>{f.col5}</label>
                    <textarea style={S.textarea} rows={3} value={stage.resources}
                      onChange={e => updateStage(i,"resources",e.target.value)}/>
                  </div>
                </div>
              </div>
            ))}
            <button style={S.btnGreen} onClick={handleDownload}>⬇ {f.dl}</button>
            <button style={S.btnSecondary} onClick={() => setStep(1)}>← {f.back}</button>
          </>
        )}

        {step === 3 && (
          <>
            <div style={S.successBox}>
              <div style={{ fontSize:60, marginBottom:12 }}>🎉</div>
              <h2 style={{ color:"#0d3b6e", fontSize:22, fontWeight:700, margin:"0 0 8px" }}>{f.done}</h2>
              <p style={{ color:"#546e7a", fontSize:13, margin:"0 0 20px", lineHeight:1.5 }}>{f.doneMsg}</p>
              <button style={{ ...S.btnGreen, width:"auto", padding:"11px 28px", display:"inline-block", marginBottom:0 }}
                onClick={handleDownload}>
                🔄 {lang==="en"?"Download again":lang==="ru"?"Скачать снова":"Қайта жүктеу"}
              </button>
            </div>
            <button style={S.btnPrimary} onClick={resetAll}>+ {f.newPlan}</button>
            <button style={S.btnSecondary} onClick={() => setStep(2)}>✏ {f.editDl}</button>
          </>
        )}
      </div>
      <div style={S.footer}>
        «Жасанды интеллект – Болашақтың кілті» 🏆 • AI-Студия • Байғанин ауданы
      </div>
    </div>
  );
}
