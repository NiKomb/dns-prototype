// Keep short Russian prepositions with the next word in every journal consumer.
export function journalText(value){
 return String(value).replace(/(^|[\s(«„])((?:после|перед|через|между|без|для|при|над|под|про|из|на|по|от|до|за|во|ко|со|об|в|к|с|у|о)) (?=\S)/giu,'$1$2\u00a0');
}

// Display prose without sentence periods; retain decimal separators and URLs.
export function journalTextWithoutPeriods(value){
 return journalText(value).replace(/\.(?=\s|$)/g,'');
}
