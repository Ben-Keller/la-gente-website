// Descriptions recovered from the owner's WordPress Modula gallery metadata.
// Wording is lightly edited; no photographer credit or exact dates are inferred.
// Entries without descriptions remain uncaptioned pending visual/editorial review.
export const galleryCaptions: Record<string, string> = {
  media19: 'De la Cruz heads home after working at the salt pools.',
  media7: 'Dusk in Iquitos, in the Peruvian Amazon.',
  media29: 'Farmers and musicians from the Challabamba district celebrate the Andean New Year.',
  media46: 'Layner, a Shipibo plant healer, after performing an original song.',
  media50: 'Aguardiente, known as “fire water.”',
  media45: 'Jonathan takes a break near Pastoruri in the Ancash region.',
  media5: 'Don Enrique offers a double thumbs-up.',
  media14: 'Children buy food and goods from a travelling boat-store on Lake Titicaca.',
  media26: 'Participants perform the linderaje along mountain ridges.',
  media38: 'Guillermina, a sheep herder near Pastoruri.',
  media47: 'Puricho demonstrates the use of a blowgun.',
  media12: 'Luis’s daughter waits for a sunset fishing trip.',
  media24: 'Community members sound pitutus during the Andean New Year ceremony.',
  InkaDogRuins: 'A Peruvian hairless dog among archaeological ruins on Peru’s northern coast.',
  media44: 'Members of communities around Pitukiska walk the mountain ridges.',
  media51: 'Llamas above an Andean lake.',
  media25: 'A quiet moment before the ceremony.',
  media49: 'Preparing to return to Huaraz from the Cordillera Blanca near Pastoruri.',
  media20: 'Preparing for the planting season outside Chinchero.',
  media6: 'Horses on a ridge above a midday break.',
  media39: 'Luis carries his daughter aboard a fishing boat.',
  media34: 'Playing a PVC-pipe flute in a greenhouse.',
  media22: 'Cinematographer Ben Keller takes in the view.',
  media18: 'A parade in Huaraz.',
  main7: 'A boy paddles along an Amazon tributary in Iquitos.',
};

// Preserve the rebuild's selections and add the two omitted original gallery images.
export const galleryIds = [
  ...[1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,18,19,20,22,23,24,25,26,28,29,30,31,32,33,34,35,36,37,38,39,40,42,43,44,45,46,47,49,50,51,52].map((n) => `media${n}`),
  'InkaDogRuins', 'main7',
];
