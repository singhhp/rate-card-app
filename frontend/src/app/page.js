"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

export default function Home() {
  const [rateCardEntries, setRateCardEntries] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    identifier: "Ground", // Default option for dropdown
    zone: "",
    discount: 0,
    published_price: 0,
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    const clientCost =
      parseFloat(formData.published_price) * (1 - formData.discount / 100);

    const newEntry = { ...formData, client_cost: clientCost };
    setRateCardEntries([...rateCardEntries, newEntry]);
    setFormData({
      description: "",
      identifier: "Express",
      zone: "",
      discount: 0,
      published_price: 0,
    });
  };

  const exportToCSV = () => {
    const csvContent = rateCardEntries.map((entry) =>
      [
        entry.description,
        entry.identifier,
        entry.zone,
        entry.discount,
        entry.published_price,
        entry.client_cost,
      ].join(",")
    );
    const csvBlob = new Blob(
      [
        [
          "Description,Identifier,Zone,Discount,Published Price,Client Cost\n",
        ].concat(csvContent).join("\n"),
      ],
      {
        type: "text/csv",
      }
    );
    const url = window.URL.createObjectURL(csvBlob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "rate_card.csv");
    a.click();
  };

 const exportToXLSX = () => {
    // Prepare data with headers
    const data = rateCardEntries.map((entry) => ({
        Description: entry.description,
        Identifier: entry.identifier,
        Zone: entry.zone,
        Discount: entry.discount,
        "Published Price": entry.published_price, // Use matching key
        "Client Cost": entry.client_cost,         // Use matching key
    }));

    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create the header row with styling
    const headerRow = [
        { v: "Description", s: { fill: { fgColor: { rgb: "CCCCCC" } }, font: { bold: true } } },
        { v: "Identifier", s: { fill: { fgColor: { rgb: "CCCCCC" } }, font: { bold: true } } },
        { v: "Zone", s: { fill: { fgColor: { rgb: "CCCCCC" } }, font: { bold: true } } },
        { v: "Discount", s: { fill: { fgColor: { rgb: "CCCCCC" } }, font: { bold: true } } },
        { v: "Published Price", s: { fill: { fgColor: { rgb: "CCCCCC" } }, font: { bold: true } } },
        { v: "Client Cost", s: { fill: { fgColor: { rgb: "CCCCCC" } }, font: { bold: true } } },
    ];

    // Add header to worksheet
    headerRow.forEach((cell, index) => {
        const cellAddress = XLSX.utils.encode_cell({ c: index, r: 0 }); // Cell address for header
        worksheet[cellAddress] = cell; // Assign the styled header cell
    });

    // Append data to worksheet
    XLSX.utils.sheet_add_json(worksheet, data, { header: ["Description", "Identifier", "Zone", "Discount", "Published Price", "Client Cost"], skipHeader: true, origin: -1 });

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "RateCard");

    // Save the workbook
    XLSX.writeFile(workbook, "rate_card.xlsx");
};


  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Rate Card Data", 10, 10);

    let yPosition = 20;
    const lineHeight = 10;

    rateCardEntries.forEach((entry, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(`Entry ${index + 1}:`, 10, yPosition);
      doc.text(`Description: ${entry.description}`, 10, yPosition + lineHeight);
      doc.text(`Identifier: ${entry.identifier}`, 10, yPosition + lineHeight * 2);
      doc.text(`Zone: ${entry.zone}`, 10, yPosition + lineHeight * 3);
      doc.text(`Discount: ${entry.discount}`, 10, yPosition + lineHeight * 4);
      doc.text(`Published Price: $${entry.published_price}`, 10, yPosition + lineHeight * 5);
      doc.text(`Client Cost: $${entry.client_cost}`, 10, yPosition + lineHeight * 6);

      yPosition += lineHeight * 7;
    });

    doc.save("rate_card.pdf");
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };
  return (
    <div className="min-h-screen bg-[#2E3047]">
      {/* Navbar */}
      <nav className="bg-[#3C3F58] p-4">
        <h1 className="text-white text-2xl font-bold text-center">Rate Card Assignment - Harshwardhan</h1>
      </nav>
      {/* Form Section */}
      <div className="container mx-auto p-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="w-full md:w-1/2 bg-[#3C3F58] rounded-lg shadow-md p-6 shadow-black">
            <h1 className="text-3xl font-bold text-white-800 mb-6">Add Rate Card Entry</h1>
            <div className="flex flex-col bg-[#3C3F58] space-y-4">
              {/* Form Inputs */}
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">Description</label>
                <input
                  className="w-full p-3 border bg-[#3C3F58] border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="description"
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">Identifier</label>
                <select
                  className="w-full p-3  border bg-[#3C3F58] border-black-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                >
                  <option value="Express">Express</option>
                  <option value="Ground">Ground</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">Zone</label>
                <input
                  className="w-full p-3 border  bg-[#3C3F58] border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="zone"
                  placeholder="Enter Zone"
                  value={formData.zone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">Discount (%)</label>
                <input
                  className="w-full p-3 border bg-[#3C3F58] border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  type="number"
                  name="discount"
                  placeholder="Enter Discount"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">Published Price</label>
                <input
                  className="w-full p-3 border bg-[#3C3F58] border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  type="number"
                  name="published_price"
                  placeholder="Enter Published Price"
                  value={formData.published_price}
                  onChange={handleChange}
                />
              </div>
              {/* Add Button */}
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
              >
                Add to Rate Card
              </button>
            </div>
          </div>

          {/* Rate Card Table */}
          <div className=" w-full md:w-1/2 bg-[#43455C] rounded-lg shadow-md p-6 shadow-black">
            <h1 className="text-3xl font-bold text-white mb-6">Rate Card Entries</h1>
            {rateCardEntries.length > 0 ? (
              <div className="bg-[#43455C] rounded-lg shadow-md p-6 overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Description</th>
                      <th className="py-3 px-6 text-left">Identifier</th>
                      <th className="py-3 px-6 text-left">Zone</th>
                      <th className="py-3 px-6 text-left">Discount</th>
                      <th className="py-3 px-6 text-left">Published Price</th>
                      <th className="py-3 px-6 text-left">Client Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rateCardEntries.map((entry, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-black">
                        <td className="py-3 px-6">{entry.description}</td>
                        <td className="py-3 px-6">{entry.identifier}</td>
                        <td className="py-3 px-6">{entry.zone}</td>
                        <td className="py-3 px-6">{entry.discount}</td>
                        <td className="py-3 px-6">${entry.published_price}</td>
                        <td className="py-3 px-6">${entry.client_cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
              </div>
            ): (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-400">No entries added yet.</p>
              </div>
            )}
            {/* Export Button */}
            <div className="mt-6 relative inline-block text-left">
                  <button
                    onClick={toggleDropdown}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center"
                  >
                    Export as
                    <svg
                      className="ml-2 w-4 h-4 transform transition-transform duration-200"
                      style={{ transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-white ring-opacity-5 z-10">
                      <div className="py-1">
                        <button
                          onClick={exportToCSV}
                          className="block px-4 py-2 text-sm text-black hover:bg-white-100"
                        >
                          CSV
                        </button>
                        <button
                          onClick={exportToXLSX}
                          className="block px-4 py-2 text-sm text-black hover:bg-white-100"
                        >
                          XLSX
                        </button>
                        <button
                          onClick={exportToPDF}
                          className="block px-4 py-2 text-sm text-black hover:bg-white-100"
                        >
                          PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
          </div>
        </div>
      </div>
    </div>
  );
}
