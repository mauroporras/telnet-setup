import firebase from 'firebase-admin'

// import serviceAccount from '../../firebase_service_account_key.json' assert { type: 'json' };
//import serviceAccount from '../../firebase_service_account_key.json';
// import serviceAccount from '../../firebase_service_account_key.json' assert { type: 'json' }
// const serviceAccount = {
//   type: 'service_account',
//   project_id: 'zahner-development',
//   private_key_id: 'f73f75f9b448e1a453871402c2525ada8404c1b7',
//   private_key:
//     '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCUVnz6laKXu/lO\n372O7HnIMo1G/fHY2MF6xJ9szOdSATCIJ75rSxq36zNbJWyRMVPFx7tWoi/QI95m\naF0qQGP50m6qsAl9GLLi8dZGb8K8g3oST5cADGJLnxTKOtP2YYMrqVVvwZRRwK7L\nEJDiMnOWFIPGnazW5Lb9aDfcLUf+F0Jvb4g+RN30f+OZV74fcgehLaPgW9sUuJqN\n8bhwsB8cNocSCfr4fa/qn1FFg321dEPCD7mkhh2JJGT2On0945+vErzdwGPOd4j6\npeTI5hL4ecaf2igsWqgKiAkYRsh/iFpiGqQ4iNKThBIVz/Y33noG6LUxa2WyPgqf\n44i4MLTRAgMBAAECggEADSUS4yPCaj7Ci25BPnqPGiH8qfdT6Jrgnk/xLrODph0r\n30ziT2Cy5+xkOyX4Vm9wFH0sCTPLF98t1JZX9ygIk/lFTEPYO2kmZPz4N3qs34ap\nGRlLcLooNbpNndQTt2gRtxtE0mftjEcOVjlMFXdSDdEYkk+jotFWs+L53D14/TeQ\n5N7lzONBbGc10ikJPhn3FRNeFPnENDQKcQkoxJjwLecA2WSyT8cUk13ElEjhRSKV\nZaCFI0tDR5NBWjvo7r/OG15+8WKlcrUjCdttzNK2FhBoYSq2Wlr8CTZ0aFT5SLRX\nURF3q+6cvqBGemk17QQdc9ij2i1iytBwjt+1EXOn7wKBgQDGuo8CoThSeJpYnesJ\nolW9t+qlYcaOpCnDj39sl3oDzIuTdUshLsdFQ1LDqA6CWrobCVQjZbKh2pXkiurP\ns9b4XgAPMUXtFPHenN71EqhUnJLKtIQtgw2pSZHX1mDjNGN7W+lg2DgjTf3aZ0og\nZ4ESQfGuOGluXB/s93q8kol1fwKBgQC/Fkh1DGrBDq4lNHi+UAz2ZecZuKqgN4Gn\nOpcoFmicebDekXVya1cN0kjrPZrSqsM3XoZY9YYeK9rrSzsVsgraRD2qZRt/rfgc\nXCAgkIHljo0xlaNzVHO/PxmEmhCrzdxKf1u/I0tuZV8zh6g5vEMcyhim+PP+bLLq\nqhhDnxYdrwKBgQCM2dlWsdHrkhNDT9own+BJcTtcMGq82tnHA8P6wXn3i1g6EV5I\njJEsJEVa65gtCATz+K6rz/7F/NlUfKlkwUBSFL3SBsha+wdbErBr3udz4O2hwkQU\nxdg+7ifyZL2TC6Se4EwPGfDgBP0xeRfu062FtTuIke8YCy+NkvJpCStoHQKBgErc\nZPiOK8iEgs8Kln8gh2OEmpwmD5qDBGVKe+t1k/gxaIxZeiSgTtOYXX7jfKMpyR8J\nBiMV1Tw+vB5QM86VGNFXyLzXrYVA16HsqZ14X5taVJBnakiFfm8fPlUHsp5MIRCC\ngqQIJMYUKs7aR5qO2dAOkMfhYl17okBy8NyVF6n7AoGAQjuPbuMyC2dP5CXHd6tu\ncxL1pv2MNm8YayAFMUSzgzvPTADRnXqAPx+2VerlfS/fGYYYfjn0KoJwfPUmlIHn\nHTaha4CKk/0Pyt8X0lZbAU4uQ6rswPiMaHAjZFesQk5eBMIva2G0M7eq3aPXYwh0\nxVm7CWTg9/hLHNI3vmlMB34=\n-----END PRIVATE KEY-----\n',
//   client_email:
//     'firebase-adminsdk-wne0q@zahner-development.iam.gserviceaccount.com',
//   client_id: '108822251053500650747',
//   auth_uri: 'https://accounts.google.com/o/oauth2/auth',
//   token_uri: 'https://oauth2.googleapis.com/token',
//   auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
//   client_x509_cert_url:
//     'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wne0q%40zahner-development.iam.gserviceaccount.com',
// }

// const serviceAccount = {
//   type: 'service_account',
//  //project_id: "zahner-production-8e2af",
//   project_id: "csc-surveylink",
//   private_key_id: "71621f0ad5a838b9d0ae88d69a5066e743c5fa5a",
//   private_key:
//     '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDGoaeDDH9i1M+/\nP/aghXd0TMmuPuLu9IWqNyrmeTbbgEL0RDt8j7HtFrjo+w2MbKeDHPiCQSqGJ7iz\nkgQ1S81/IKm3dMGutJixESKDsnHZzncaBfAe5ijtgat/FA6B7GiyeehV5t3EKQ/X\nimxZg4t14riA6/GYZPVrchVRNRhsTGHVirnI9TtfqqcjSg1cVfdFg62+vzAIyj8B\nudFivo9t/ZbIoJ+x4Lz0ByPDyJMm7uehVYRYbzDKeDi0FjvV9rs0j7ya7JR9sLfT\nriAiKoCft98/89p2YTHOULJRG1Jep9Q9kuHS4wT4RLXcS+wdGuBjLKqTUf93/4uV\nFJTmovCpAgMBAAECggEACezadLUraVoWbmlJDtDUfPp4Sm1ohAWyZyS+D0mnyNSS\nI+gD6++3NZBg2X1v+iAUx7urHEEa2ZzDATAO50XcJRnR+TGLmwn5pkFjrt58C2Ti\ndSmuS7D3AxUrZ1xudCYGvkJSrnYshyiBGuVXECr/TTrwurpvdky3KbEH6SikyYZ6\nAR1z1UYs9H6gsj8g5eG0uPFWCOollj/fO1q1jnnsLp6nCIt9rw3Sq8fpzy9tv1oG\nfvsVKfTSDEiN2q3/7oOSAnQhPv5C7N8vxNooxbgwsnC6Xsu1h9XXQEWaOPqhnG2d\ngm0gBad4XfFQyQSbY5r0xMt7uWNImkhRbNlHnW0DDQKBgQDpxixVbgTA/BMdjj5E\nMhd9gghBRysa5exzU3ZoAtCr3LIXnS7Hns4KIu/MSMQoTNCjXXIlWLLVXOQq0Mnf\nffGwy0FWwavOadIeOQFoQEGIHR3GGE5ShLJxaaG4ThUlHmw53Ad/IHIxnfR8Wl2a\ntb5h5P7pquo1PqQ78ak79vJwrQKBgQDZhCT1MZqvEJ+YDeCkXSWMsIo4STUF4X8l\n5S9i8zDkIYnoGk2csqofkW51oN+4Uer/GbAJ4lL1ditjX1AkuNaBfOW/GBWvzqNG\nSY4pf4f2pLEOnnv5wwXZnXgAUWenD41HtXkizp9+Z3OtoNttPJK8sx8xMfdqarDM\nLQdJoyCzbQKBgQDXvwf9U8rZXAo8NaFriJs7Pn1l2UuDyHxetsFJHof8hHJr7qlU\nm0/l9PZAH0vBMZs/macVpnVtCgydIxGby/z5P6wuaBCqL+k18UBGOT8BYnWu85Gd\nAFA68NTKZm2HUztobpMQlR4ugms3NKK8fEyWxiMn/Y+m0gf6Nn4MFE0NBQKBgQCb\nbLYv0hMSltFDCF+Fct1660bIs17E5f1BqcMzdExyJpjxFaJxnqS7S+LfAGX7weUm\nBUfpuCPJK3gTWK7enokAG6va4S3V4tR+S97ePjd8APBXXt19eWI7vi5aI9Dp6c3s\n+HonafdDjk51OaSxKIA9f8yBDZAaJURRkLdNYdfi/QKBgQCXnvKg/V4m4Pn0OTkf\nzAQ4tWXakJmuD6VFDkH3ZglPNIokdrAzwAymzbf5r3JYtrUmjDzIVVijDpAcRY+z\nsbRa9rUwqp7A8QEC2Z4ECXsCmgRy57iQmu0muarVdEo0oCyb6aFmsjEkE/S6jRs3\neIl1jRPtozYtDw9KL6oolGDP5w==\n-----END PRIVATE KEY-----\n',
//   client_email:
//     'firebase-adminsdk-ul55x@zahner-production-8e2af.iam.gserviceaccount.com',
//   client_id: '108625038685774307556',
//   //auth_uri: 'https://accounts.google.com/o/oauth2/auth',
//   auth_uri: 'csc-surveylink.firebaseapp.com',
//   token_uri: 'https://oauth2.googleapis.com/token',
//   auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
//   client_x509_cert_url:
//     'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ul55x%40zahner-production-8e2af.iam.gserviceaccount.com',
// }

const firebaseConfig = {
  apiKey: "AIzaSyCIoL9RlD15JzJo1XDPBzTm1xR6StBUaxI",
  authDomain: "csc-surveylink.firebaseapp.com",
  projectId: "csc-surveylink",
  storageBucket: "csc-surveylink.appspot.com",
  messagingSenderId: "473701857342",
  appId: "1:473701857342:web:73573aa5b8fc7db50b396f",
  measurementId: "G-71DM2KZP94"
};






firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.GCP_PROJECT_ID}.firebaseio.com`,
})

// const firebaseConfig = {
//   apiKey: "AIzaSyCwm0Nex3W_jTBFZWAofXH7r4mTa3bdosw",
//   authDomain: "zahner-production-8e2af.firebaseapp.com",
//   projectId: "zahner-production-8e2af",
//   storageBucket: "zahner-production-8e2af.appspot.com",
//   messagingSenderId: "379521829525",
//   appId: "1:379521829525:web:8e360f3265ebb300b6299c",
//   measurementId: "G-9M6F508LJ7",

// };

// firebase.initializeApp(firebaseConfig)

// firebase.analytics()

// firebase.auth().signInAnonymously()

const db = firebase.firestore()


const { serverTimestamp } = firebase.firestore.FieldValue

export { db, serverTimestamp }
