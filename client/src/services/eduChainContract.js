import { ethers } from 'ethers';
import eduChainAbi from './EduChainABI.json';

// Replace with your deployed contract address
const EDUCHAIN_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export function getEduChainContract(signerOrProvider) {
  return new ethers.Contract(EDUCHAIN_ADDRESS, eduChainAbi, signerOrProvider);
}

export async function issueCredential({ signer, holder, degreeTitle, institutionName, issueDate, credentialId }) {
  const contract = getEduChainContract(signer);
  const tx = await contract.issueCredential(holder, degreeTitle, institutionName, issueDate, credentialId);
  await tx.wait();
  return tx;
}

export async function getCredentialCount(provider) {
  const contract = getEduChainContract(provider);
  return await contract.getCredentialCount();
}

export async function getMyCredentials(signer) {
  const contract = getEduChainContract(signer);
  return await contract.getMyCredentials();
}

export async function verifyCredential(provider, credentialId) {
  const contract = getEduChainContract(provider);
  return await contract.verifyCredential(credentialId);
} 