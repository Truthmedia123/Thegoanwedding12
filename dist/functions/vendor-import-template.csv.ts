export const onRequestGet = async () => {
  const csvContent = `name,category,location,contactEmail,minPrice,maxPrice,rating,isVerified,facebookUrl,instagramUrl,linkedinUrl,twitterUrl,embedCode
Sample Caterer,Caterers,North Goa,caterer@example.com,50000,200000,4.5,true,https://facebook.com/caterer,https://instagram.com/caterer,https://linkedin.com/in/caterer,https://twitter.com/caterer,
Sample Photographer,Photography,South Goa,photographer@example.com,30000,150000,4.8,true,https://facebook.com/photographer,https://instagram.com/photographer,,,`;

  return new Response(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="vendor-import-template.csv"',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
