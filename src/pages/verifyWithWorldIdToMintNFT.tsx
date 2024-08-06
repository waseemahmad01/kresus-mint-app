// @ts-ignore
import { VerificationLevel, IDKitWidget } from '@worldcoin/idkit';
// @ts-ignore
import type { ISuccessResult } from '@worldcoin/idkit';
import type { VerifyReply } from './api/verify';
import nftIg from './../../public/nft.jpg';
import Image from 'next/image';
import React, { SetStateAction, useEffect } from 'react';
// @ts-ignore
import { Card, CardHeader, CardFooter, Divider } from '@nextui-org/react';
import mintNFT from '../smartContractInteraction/mintNFT';
import { useState, useId } from 'react';
// @ts-ignore
import ReactConfetti from 'react-confetti';
import { File } from 'buffer';

export default function verifyWithWorldIdToMintNFT() {
  let [NFTHashLink, setNFTHashLink] = useState('not found');
  let [NFTHashText, setNFTHashText] = useState('not found');
  let [hashColor, setTextColor] = useState('red');

  const [image, setImage] = useState<File | null>(null);

  const [mintedHash, setMintedHash] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const picker = useId();

  function toggle(link: SetStateAction<string>) {
    setNFTHashLink(link);
    setNFTHashText('View Your NFT');
    setTextColor('green');
  }

  if (!process.env.NEXT_PUBLIC_WLD_APP_ID) {
    throw new Error('app_id is not set in environment variables!');
  }
  if (!process.env.NEXT_PUBLIC_WLD_ACTION) {
    throw new Error('action is not set in environment variables!');
  }

  const onSuccess = async (result: ISuccessResult) => {
    // This is where you should perform frontend actions once a user has been verified, such as redirecting to a new page
    var mintNFTResult = await mintNFT();
    console.log(
      'Minted NFT Hash: https://sepolia.etherscan.io/tx/' + mintNFTResult
    );
    setMintedHash(mintNFTResult as string);
    setOpenModal(true);
    setShowConfetti(true);
    // window.alert(
    //   'Successfully verified with World ID! Your NFT is Minted on sepolia testnet chain\nNFT Hash: ' +
    //     mintNFTResult
    // );
    // toggle(process.env.NEXT_PUBLIC_SEPOLIA_LINK! + mintNFTResult);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files?.length) {
      // @ts-ignore
      setImage(files[0]);
    }
  };

  const handleProof = async (result: ISuccessResult) => {
    console.log('Proof received from IDKit:\n', JSON.stringify(result)); // Log the proof from IDKit to the console for visibility
    const reqBody = {
      merkle_root: result.merkle_root,
      nullifier_hash: result.nullifier_hash,
      proof: result.proof,
      verification_level: result.verification_level,
      action: process.env.NEXT_PUBLIC_WLD_ACTION,
      signal: '',
    };
    console.log(
      'Sending proof to backend for verification:\n',
      JSON.stringify(reqBody)
    ); // Log the proof being sent to our backend for visibility
    const res: Response = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    });
    const data: VerifyReply = await res.json();
    if (res.status == 200) {
      console.log('Successful response from backend:\n', data); // Log the response from our backend for visibility
    } else {
      throw new Error(
        `Error code ${res.status} (${data.code}): ${data.detail}` ??
          'Unknown error.'
      ); // Throw an error if verification fails
    }
  };

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [showConfetti]);

  return (
    <div>
      <div className='flex flex-col items-center justify-center align-middle h-screen'>
        <Card
          className='border rounded-md'
          style={{ width: 300, marginTop: 20, borderRadius: 10 }}
        >
          <CardHeader>
            <div className='w-full aspect-square bg-gray-200'>
              <label htmlFor={picker}>
                <div className='relative w-full h-full rounded-md overflow-hidden flex items-center justify-center flex-col cursor-pointer gap-4'>
                  <Image src='/upload.png' width={50} height={50} alt='' />
                  <p className='text-base'>Click to Upload image</p>
                  {image && (
                    <Image
                      src={URL.createObjectURL(image)}
                      className='aspect-square w-full rounded'
                      fill
                      style={{ objectFit: 'cover' }}
                      alt=''
                    />
                  )}
                </div>
              </label>
              <input
                type='file'
                name=''
                className='hidden'
                id={picker}
                onChange={handleImageChange}
              />
            </div>
            {/* <Image src={nftIg} className='rounded-md' alt='NFT' /> */}
          </CardHeader>
          <Divider />
          <CardFooter style={{ margin: 20, color: '#030a74' }}>
            <div className='flex flex-col'>
              <text style={{ fontSize: 15, fontWeight: 'bold' }}>
                <pre>{'Early Human #5481'}</pre>
              </text>
              <text style={{ fontSize: 12 }}>
                <pre>{'Limited Edition Early Human Filter'}</pre>
              </text>
            </div>
          </CardFooter>
        </Card>
        <Card style={{ width: 300, fontSize: 13, marginTop: 10 }}>
          <CardHeader style={{ marginTop: 10 }}>
            <div className='flex flex-col'>
              <text style={{ fontWeight: 'bold', color: '#030a74' }}>
                <pre>{'My NFTs on App'}</pre>
              </text>
              <Image
                src={nftIg}
                className='rounded-md'
                width={120}
                height={100}
                alt='NFT'
                style={{ marginTop: 5 }}
              />
            </div>
          </CardHeader>
          <Divider style={{ marginTop: 10 }} />
          <CardFooter style={{ marginTop: 10, color: '#030a74' }}>
            <div className='flex flex-col'>
              <div className='flex flex-row'>
                <text>
                  <pre>{'Blockchain'}</pre>
                </text>
                <text style={{ fontWeight: 'bold' }}>
                  <pre>{'                     Etheruem'}</pre>
                </text>
              </div>
              <div className='flex flex-row'>
                <text>
                  <pre>{'Token Standard'}</pre>
                </text>
                <text style={{ fontWeight: 'bold' }}>
                  <pre>{'                 ERC-721'}</pre>
                </text>
              </div>
              <div className='flex flex-row'>
                <text>
                  <pre>{'Minted NFT                     '}</pre>
                </text>
                <a
                  href={NFTHashLink}
                  style={{ color: hashColor, fontWeight: 'bold' }}
                >
                  {NFTHashText}
                </a>
              </div>
            </div>
          </CardFooter>
        </Card>
        <IDKitWidget
          action={process.env.NEXT_PUBLIC_WLD_ACTION!}
          app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
          onSuccess={onSuccess}
          handleVerify={handleProof}
          verification_level={VerificationLevel.Device} // Change this to VerificationLevel.Device to accept Orb- and Device-verified users
        >
          {/* @ts-ignore */}
          {({ open }) => (
            <button
              onClick={open}
              className='rounded-full text-white font-bold'
              style={{
                height: 45,
                width: 310,
                marginTop: 30,
                background: '#030a74',
              }}
            >
              Verify with World ID to Mint NFT
            </button>
          )}
        </IDKitWidget>
      </div>
      {openModal && (
        <div
          className='fixed top-0 left-0 h-full w-full bg-[#00000033] flex items-center justify-center'
          style={{ backdropFilter: 'blur(2px)' }}
        >
          <div className='w-full max-w-[420px] bg-white rounded-lg p-6'>
            <div className='flex justify-center'>
              <Image
                src='/nft.jpg'
                width={80}
                height={80}
                className='rounded-md'
                alt=''
              />
            </div>
            <p className='text-2xl font-semibold  text-center mt-5'>
              Congratulations 🎉🎉
            </p>
            <p className='text-base text-center mt-1'>
              Successfully verified with World ID! Your NFT is Minted on sepolia
              testnet chain
            </p>
            <a
              href={`${process.env.NEXT_PUBLIC_SEPOLIA_LINK!}${mintedHash}`}
              rel='noopenner noreferrer'
              target='_blank'
            >
              <p className='text-base  mt-4 break-words text-[#0000EE]'>
                {`${process.env.NEXT_PUBLIC_SEPOLIA_LINK!}${mintedHash}`}
              </p>
            </a>
            <button
              onClick={handleCloseModal}
              className='w-full h-12 rounded-lg mt-5 text-white font-medium text-base bg-[#030a74]'
            >
              Continue
            </button>
          </div>
          {showConfetti && (
            <ReactConfetti
              className='z-20'
              onConfettiComplete={(confetti: any) => {
                confetti?.stop();
                setShowConfetti(false);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
