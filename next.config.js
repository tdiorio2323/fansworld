/** @type {import('next').NextConfig} */
module.exports = {
  async headers(){return[{source:"/(.*)",headers:[
    {key:"Strict-Transport-Security",value:"max-age=63072000; includeSubDomains; preload"},
    {key:"X-Content-Type-Options",value:"nosniff"},
    {key:"X-Frame-Options",value:"SAMEORIGIN"},
    {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
    {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=()"}
  ]}]}
};
