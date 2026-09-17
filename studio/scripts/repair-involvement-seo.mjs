import {getCliClient} from 'sanity/cli';
const client=getCliClient({apiVersion:'2026-09-17'}).withConfig({projectId:'80rpogyy',dataset:'production',useCdn:false,perspective:'raw'});
const docs=await client.fetch('*[_id in ["involvementPage","drafts.involvementPage"]]{_id,_rev,seo}');
for(const doc of docs) {
  // The import accidentally concatenated an SVG accessibility title with <head><title>.
  if(doc.seo?.title==='Get Involved — La Gente de La TierraMap of organizations across Peru') {
    await client.patch(doc._id).ifRevisionId(doc._rev).set({'seo.title':'Get Involved — La Gente de La Tierra'}).commit();
    console.log(`Repaired imported SEO title: ${doc._id}`);
  }
}
