import firebase from 'firebase-admin'

// import serviceAccount from '../../firebase_service_account_key.json' assert { type: 'json' };
//import serviceAccount from '../../firebase_service_account_key.json';
// import serviceAccount from '../../firebase_service_account_key.json' assert { type: 'json' }
const serviceAccount = {
  type: 'service_account',
  project_id: 'zahner-development',
  private_key_id: 'f73f75f9b448e1a453871402c2525ada8404c1b7',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCUVnz6laKXu/lO\n372O7HnIMo1G/fHY2MF6xJ9szOdSATCIJ75rSxq36zNbJWyRMVPFx7tWoi/QI95m\naF0qQGP50m6qsAl9GLLi8dZGb8K8g3oST5cADGJLnxTKOtP2YYMrqVVvwZRRwK7L\nEJDiMnOWFIPGnazW5Lb9aDfcLUf+F0Jvb4g+RN30f+OZV74fcgehLaPgW9sUuJqN\n8bhwsB8cNocSCfr4fa/qn1FFg321dEPCD7mkhh2JJGT2On0945+vErzdwGPOd4j6\npeTI5hL4ecaf2igsWqgKiAkYRsh/iFpiGqQ4iNKThBIVz/Y33noG6LUxa2WyPgqf\n44i4MLTRAgMBAAECggEADSUS4yPCaj7Ci25BPnqPGiH8qfdT6Jrgnk/xLrODph0r\n30ziT2Cy5+xkOyX4Vm9wFH0sCTPLF98t1JZX9ygIk/lFTEPYO2kmZPz4N3qs34ap\nGRlLcLooNbpNndQTt2gRtxtE0mftjEcOVjlMFXdSDdEYkk+jotFWs+L53D14/TeQ\n5N7lzONBbGc10ikJPhn3FRNeFPnENDQKcQkoxJjwLecA2WSyT8cUk13ElEjhRSKV\nZaCFI0tDR5NBWjvo7r/OG15+8WKlcrUjCdttzNK2FhBoYSq2Wlr8CTZ0aFT5SLRX\nURF3q+6cvqBGemk17QQdc9ij2i1iytBwjt+1EXOn7wKBgQDGuo8CoThSeJpYnesJ\nolW9t+qlYcaOpCnDj39sl3oDzIuTdUshLsdFQ1LDqA6CWrobCVQjZbKh2pXkiurP\ns9b4XgAPMUXtFPHenN71EqhUnJLKtIQtgw2pSZHX1mDjNGN7W+lg2DgjTf3aZ0og\nZ4ESQfGuOGluXB/s93q8kol1fwKBgQC/Fkh1DGrBDq4lNHi+UAz2ZecZuKqgN4Gn\nOpcoFmicebDekXVya1cN0kjrPZrSqsM3XoZY9YYeK9rrSzsVsgraRD2qZRt/rfgc\nXCAgkIHljo0xlaNzVHO/PxmEmhCrzdxKf1u/I0tuZV8zh6g5vEMcyhim+PP+bLLq\nqhhDnxYdrwKBgQCM2dlWsdHrkhNDT9own+BJcTtcMGq82tnHA8P6wXn3i1g6EV5I\njJEsJEVa65gtCATz+K6rz/7F/NlUfKlkwUBSFL3SBsha+wdbErBr3udz4O2hwkQU\nxdg+7ifyZL2TC6Se4EwPGfDgBP0xeRfu062FtTuIke8YCy+NkvJpCStoHQKBgErc\nZPiOK8iEgs8Kln8gh2OEmpwmD5qDBGVKe+t1k/gxaIxZeiSgTtOYXX7jfKMpyR8J\nBiMV1Tw+vB5QM86VGNFXyLzXrYVA16HsqZ14X5taVJBnakiFfm8fPlUHsp5MIRCC\ngqQIJMYUKs7aR5qO2dAOkMfhYl17okBy8NyVF6n7AoGAQjuPbuMyC2dP5CXHd6tu\ncxL1pv2MNm8YayAFMUSzgzvPTADRnXqAPx+2VerlfS/fGYYYfjn0KoJwfPUmlIHn\nHTaha4CKk/0Pyt8X0lZbAU4uQ6rswPiMaHAjZFesQk5eBMIva2G0M7eq3aPXYwh0\nxVm7CWTg9/hLHNI3vmlMB34=\n-----END PRIVATE KEY-----\n',
  client_email:
    'firebase-adminsdk-wne0q@zahner-development.iam.gserviceaccount.com',
  client_id: '108822251053500650747',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wne0q%40zahner-development.iam.gserviceaccount.com',
}



firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.GCP_PROJECT_ID}.firebaseio.com`,
})

const db = firebase.firestore()

const { serverTimestamp } = firebase.firestore.FieldValue

export { db, serverTimestamp }
