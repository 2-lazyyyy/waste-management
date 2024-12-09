'use client'
import { useState, useEffect } from 'react'
import { ArrowRight, Leaf, Recycle, Users, Coins, MapPin, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import { Poppins } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createUser, getUserByEmail, createTransaction, getRecentReports, getReportsByUserId } from '@/utils/db/actions';

import { getUserBalance } from '@/utils/db/actions'
import { describe } from 'node:test'
import toast from 'react-hot-toast'


export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<{ id: number; email: string; name: string } | null>(null);
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const [report, setReport] = useState<number | null>(null);

  const login = () => {
    setLoggedIn(true);
  };

  useEffect(() => {
    const checkUser = async () => {
      const email = localStorage.getItem('userEmail');
      if (email) {
        let user = await getUserByEmail(email);
        if (!user) {
          user = await createUser(email, 'Anonymous User');
        }
        setUserInfo(user);
      } else {
        router.push('/login');
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    if (!userInfo) {
      return;
    }
    
    const fetchBalance = async () => {
      try {
        const balance = await getUserBalance(userInfo.id); // Wait for the promise to resolve
        const report = await getReportsByUserId(userInfo.id)
        setBalance(balance); // Set the resolved value
        setReport(report.length); // Set the resolved value
        console.log(report)
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };
  
    fetchBalance(); // Call the async function
  }, [userInfo]);

  
  async function testCreateTransaction(amount: number) {
    try {
      if (!userInfo) {
        console.error("User info is null, cannot create transaction.");
        return;
      }
  
      // Check if the user's balance is sufficient
      if (balance === null || balance < amount) {
        toast.error("Insufficient points to redeem this reward.");
        return;
      }
  
      const userId = userInfo.id; // Safely access userId after null check
      const type = 'redeemed';
      const description = 'redeemed rewards';
  
      // Proceed with the transaction if points are sufficient
      const transaction = await createTransaction(userId, type, amount, description);
      console.log("Transaction created successfully:", transaction);
  
      // Update the balance locally
      setBalance((prevBalance) => (prevBalance !== null ? prevBalance - amount : null));
  
      toast.success(`Successfully redeemed ${amount} points`);
    } catch (error) {
      console.error("Failed redemption:", error);
      toast.error("Failed redemption, please try again.");
    }
  }
  
  
  
    return (
      <div className={`container mx-auto px-4 py-16 `}>
        

        <section className="grid md:grid-cols-2 gap-10 mb-20">
        <FeatureCard
          icon='/star.png'
          title="Total Points You Collected"
          description="Earn points to exchange goods."
          amount={balance || 0} // Safely access `points`
        />
        
        <FeatureCard
          icon='/megaphone.png'
          title="Report Submitted"
          description="Report more to earn points"
          amount={report || 10}
        />
      </section>
      
      <div className='flex flex-col items-center justify-center mt-10'>
        <section className="bg-white p-10 rounded-3xl min-w-[654px] shadow-lg mb-10">
            <div className='flex justify-between items-center'>
              <div className='flex justify-between'>
                <Image src='/car.png' alt='img' width={116} height={110} />
                <div className='flex flex-col gap-[6px] justify-between'>
                  <h1>2 free YBS Tokens</h1>
                  <h1 className='text-indigo-700 font-bold'>Promotion</h1>
                  <h1 className='text-orange-500 font-semibold'>90 points</h1>
                </div>
              </div>
              <div className='w-[100px]'>
                <Button className='cursor-pointer bg-green-500 text-center text-white p-3 rounded-lg' size='lg' onClick={() => testCreateTransaction(90)}>Exchange</Button>
              </div>
            </div>
              
            
          </section>

          <section className="bg-white p-10 rounded-3xl min-w-[654px] shadow-lg mb-10">
            <div className='flex justify-between items-center'>
              <div className='flex justify-between'>
                <Image src='/shop1.jpg' alt='img' width={116} height={80} className='h-[90px]'/>
                <div className='flex flex-col gap-[0px] justify-between'>
                  <h1>5% off on your next metre bill</h1>
                  <h1 className='text-indigo-700 font-bold'>Promotion</h1>
                  <h1 className='text-orange-500 font-semibold'>120 points</h1>
                </div>
              </div>
              <div className='w-[100px]'>
              <Button className='cursor-pointer bg-green-500 text-center text-white p-3 rounded-lg' size='lg' onClick={() => testCreateTransaction(120)}>Exchange</Button>
              </div>
            </div>
              
            
          </section>

          <section className="bg-white p-10 rounded-3xl min-w-[654px] shadow-lg mb-10">
            <div className='flex justify-between items-center'>
              <div className='flex justify-between'>
                <Image src='/coffee.png' alt='img' width={116} height={90} className='h-[90px]' />
                <div className='flex flex-col gap-[6px] justify-between'>
                  <h1>1000 MMK off</h1>
                  <h1 className='text-indigo-700 font-bold'>Promotion</h1>
                  <h1 className='text-orange-500 font-semibold'>60 points</h1>
                </div>
              </div>
              <div className='w-[100px]'>
              <Button className='cursor-pointer bg-green-500 text-center text-white p-3 rounded-lg' size='lg' onClick={() => testCreateTransaction(90)}>Exchange</Button>
              </div>
            </div>
              
            
          </section>
          
      </div>
      </div>
  )
}



export function FeatureCard({ icon, title, description, amount }: { icon: string; title: string; description: string; amount: number }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col items-center text-center">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <div className='flex justify-between gap-5 items-center'>
        <p className='font-bold text-3xl text-orange-400 mb-5'>{amount}</p>
        <div className="bg-yellow-100 p-4 rounded-full mb-6">
          
          <Image src={icon} alt="icon" width={50} height={40} />
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
