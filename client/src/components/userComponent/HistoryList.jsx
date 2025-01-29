import React from "react";
import PropTypes from "prop-types";

function HistoryList(props) {
   return (
      <div>
         <header>Purchase History</header>
         {/* cover all */}
         <main>
            {/* card */}
            <article>
               {/* header */}
               <header>
                  header
                  <div>
                     <p>Order date</p>
                     <p>10 oct 2024 12:00am</p>
                  </div>
                  <div>status</div>
               </header>
               <div>table</div>
               <footer>total price</footer>
            </article>
         </main>
      </div>
   );
}

HistoryList.propTypes = {};

export default HistoryList;
