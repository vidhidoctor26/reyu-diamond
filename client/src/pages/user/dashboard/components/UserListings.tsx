// import { motion } from "framer-motion";
// import { Diamond, ArrowUpRight } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";

// const listings = [
//   { name: "Round Brilliant 2.5ct", price: "$18,500", status: "Listed", quality: "VVS1" },
//   { name: "Princess Cut 1.8ct", price: "$12,300", status: "In Inventory", quality: "VS2" },
//   { name: "Oval 3.2ct", price: "$24,800", status: "Pending Bid", quality: "IF" },
// ];

// const UserListings = () => {
//   const navigate = useNavigate();
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: 0.2 }}
//     >
//       <Card className="glass border-border">
//         <CardHeader className="flex flex-row items-center justify-between  ">
//           <CardTitle className="flex items-center gap-2">
//             <Diamond className="h-5 w-5 text-accent" />
//             Recent Diamonds
//           </CardTitle>
//           <Button
//   variant="ghost"
//   size="sm"
//   className="text-accent"
//   onClick={() => navigate("/user/listings")}
// >
//   View All
//   <ArrowUpRight className="h-4 w-4 ml-1" />
// </Button>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           {listings.map((item, index) => (
//             <div
//               key={index}
//               className="flex justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted"
//             >
//               <div className="flex gap-4">
//                 <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
//                   <Diamond className="h-6 w-6 text-accent" />
//                 </div>
//                 <div>
//                   <p className="font-medium text-primary">{item.name}</p>
//                   <p className="text-sm text-muted-foreground">{item.quality}</p>
//                 </div>
//               </div>

//               <div className="text-right">
//                 <p className="font-semibold text-primary">{item.price}</p>
//                 <span className="text-xs px-2 py-1 rounded-full bg-muted">
//                   {item.status}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// export default UserListings;
