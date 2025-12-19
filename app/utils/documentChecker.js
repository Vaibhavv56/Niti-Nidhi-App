// Utility to check if required documents exist in user's document list

export const checkRequiredDocuments = (userDocuments, requiredDocuments) => {
  const missing = [];
  const found = [];

  requiredDocuments.forEach(requiredDoc => {
    // Check if document exists (case-insensitive partial match)
    const docFound = userDocuments.find(doc => {
      const docName = doc.name.toLowerCase();
      const requiredName = requiredDoc.toLowerCase();
      
      // Check for common document name patterns
      if (requiredDoc.includes('Aadhar') || requiredDoc.includes('Aadhaar')) {
        return docName.includes('aadhar') || docName.includes('aadhaar');
      }
      if (requiredDoc.includes('PAN')) {
        return docName.includes('pan');
      }
      if (requiredDoc.includes('Bank')) {
        return docName.includes('bank') || docName.includes('account');
      }
      if (requiredDoc.includes('Income')) {
        return docName.includes('income') || docName.includes('salary');
      }
      if (requiredDoc.includes('Photo')) {
        return docName.includes('photo') || docName.includes('picture');
      }
      if (requiredDoc.includes('Address')) {
        return docName.includes('address') || docName.includes('proof');
      }
      
      // Generic check
      return docName.includes(requiredName.split(' ')[0].toLowerCase());
    });

    if (docFound) {
      found.push({ required: requiredDoc, found: docFound });
    } else {
      missing.push(requiredDoc);
    }
  });

  return { missing, found };
};

export const getDocumentByType = (userDocuments, documentType) => {
  return userDocuments.find(doc => {
    const docName = doc.name.toLowerCase();
    const type = documentType.toLowerCase();
    
    if (type.includes('aadhar') || type.includes('aadhaar')) {
      return docName.includes('aadhar') || docName.includes('aadhaar');
    }
    if (type.includes('pan')) {
      return docName.includes('pan');
    }
    if (type.includes('bank')) {
      return docName.includes('bank') || docName.includes('account');
    }
    
    return docName.includes(type.split(' ')[0]);
  });
};




