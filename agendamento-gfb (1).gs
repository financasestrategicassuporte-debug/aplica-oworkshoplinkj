/* ══════════════════════════════════════════════════
   GFB — Agendamento via Google Apps Script
   Deploy como Web App:
     Executar como: Eu (sua conta Google)
     Quem pode acessar: Qualquer pessoa, mesmo anônima
   ══════════════════════════════════════════════════ */

function doPost(e) {
  try {
    var data   = JSON.parse(e.postData.contents);
    var calId  = data.consultor_email;
    var titulo = 'Consultoria GFB — ' + data.nome;

    var inicio = new Date(data.slot_inicio);
    var fim    = new Date(data.slot_fim);

    var cal    = CalendarApp.getCalendarById(calId);
    if (!cal) {
      return resposta(false, 'Agenda não encontrada: ' + calId);
    }

    var evento = cal.createEvent(titulo, inicio, fim, {
      description: data.relatorio || '',
      guests:      data.email || '',
      sendInvites: true,
    });

    return resposta(true, 'Agendado', {
      event_id:   evento.getId(),
      event_link: 'https://calendar.google.com/calendar/event?eid=' + Utilities.base64Encode(evento.getId()),
    });

  } catch(err) {
    return resposta(false, err.toString());
  }
}

function doGet(e) {
  return resposta(true, 'GFB Agendamento API ativa');
}

function resposta(ok, msg, extra) {
  var obj = Object.assign({ ok: ok, msg: msg }, extra || {});
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
