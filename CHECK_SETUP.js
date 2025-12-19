// Quick setup checker - Run with: node CHECK_SETUP.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Firebase Setup...\n');

// Check 1: Root .env file
const rootEnvPath = path.join(__dirname, '.env');
if (fs.existsSync(rootEnvPath)) {
  console.log('✅ Root .env file exists');
  const envContent = fs.readFileSync(rootEnvPath, 'utf8');
  const requiredVars = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  ];
  
  let allPresent = true;
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      const match = envContent.match(new RegExp(`${varName}=(.+)`));
      if (match && match[1] && !match[1].includes('Dummy') && !match[1].includes('your-')) {
        console.log(`  ✅ ${varName} is set`);
      } else {
        console.log(`  ❌ ${varName} has placeholder value`);
        allPresent = false;
      }
    } else {
      console.log(`  ❌ ${varName} is missing`);
      allPresent = false;
    }
  });
  
  if (!allPresent) {
    console.log('\n⚠️  Some Firebase config values are missing or have placeholders!');
    console.log('   Update .env file with real values from Firebase Console');
  }
} else {
  console.log('❌ Root .env file NOT FOUND');
  console.log('   Create .env file in project root with Firebase config');
}

// Check 2: Backend serviceAccountKey.json
const backendKeyPath = path.join(__dirname, 'backend', 'serviceAccountKey.json');
if (fs.existsSync(backendKeyPath)) {
  console.log('\n✅ Backend serviceAccountKey.json exists');
  try {
    const keyData = JSON.parse(fs.readFileSync(backendKeyPath, 'utf8'));
    if (keyData.project_id === 'techfest-85e3b') {
      console.log('  ✅ Project ID matches: techfest-85e3b');
    } else {
      console.log(`  ⚠️  Project ID is: ${keyData.project_id} (expected: techfest-85e3b)`);
    }
  } catch (e) {
    console.log('  ❌ serviceAccountKey.json is invalid JSON');
  }
} else {
  console.log('\n❌ Backend serviceAccountKey.json NOT FOUND');
  console.log('   Download from: Firebase Console → Project Settings → Service Accounts');
}

// Check 3: Backend .env
const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(backendEnvPath)) {
  console.log('\n✅ Backend .env file exists');
  const backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
  if (backendEnv.includes('JWT_SECRET')) {
    console.log('  ✅ JWT_SECRET is set');
  } else {
    console.log('  ❌ JWT_SECRET is missing');
  }
  if (backendEnv.includes('GEMINI_API_KEY')) {
    console.log('  ✅ GEMINI_API_KEY is set');
  } else {
    console.log('  ⚠️  GEMINI_API_KEY is missing (chatbot won\'t work)');
  }
} else {
  console.log('\n⚠️  Backend .env file NOT FOUND (optional, but recommended)');
}

console.log('\n📋 Next Steps:');
console.log('1. If .env is missing, create it with Firebase config');
console.log('2. If serviceAccountKey.json is missing, download from Firebase Console');
console.log('3. Enable Phone Auth in Firebase Console → Authentication');
console.log('4. Enable Firestore in Firebase Console → Firestore Database');
console.log('5. Restart app: npm start -- --clear');



