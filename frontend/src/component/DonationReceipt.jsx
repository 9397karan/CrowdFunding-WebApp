
export default function DonationReceipt({ donation, onClose }) {
    if (!donation) return null;

    const date = new Date(donation.date || Date.now()).toLocaleString("en-IN");

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold text-green-600 text-center">
                Donation Successful!
            </h2>

            <p className="text-center text-gray-500 mt-2">
                Thank you for supporting this project.
            </p>

            <hr className="my-5" />

            <h3 className="text-lg font-semibold mb-4">Donation Receipt</h3>

            <div className="space-y-3 text-sm">
                <p><b>Donor:</b> {donation.donorName}</p>
                <p><b>Project:</b> {donation.projectName}</p>
                <p><b>Amount:</b> ₹{Number(donation.amount).toLocaleString("en-IN")}</p>
                <p><b>Date:</b> {date}</p>
                <p className="break-all">
                    <b>Payment ID:</b> {donation.paymentId}
                </p>
            </div>

            <p className="text-xs text-gray-400 mt-5">
                Keep this receipt for your records.
            </p>

            <div className="flex gap-3 mt-6">
                <button
                    onClick={() => window.print()}
                    className="flex-1 bg-indigo-600 text-white p-3 rounded-lg"
                >
                    Print / Save PDF
                </button>

                <button
                    onClick={onClose}
                    className="flex-1 border p-3 rounded-lg"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
