import MainCard from "@/components/mainCard";
import DonationForm from "@/components/donationForm";
import Donations from "@/components/recentDonations";
export default function Home() {
  return (
    <>
      <main>
        <DonationForm />
        <div className="mx-auto p-10">
          <Donations />
        </div>
      </main>
    </>
  );
}
