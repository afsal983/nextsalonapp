import React from 'react';
import { Printinvoice } from 'src/types/invoice';
// Define the props interface
interface ReceiptProps {
    printinvoice: Printinvoice;
  }

// Define the Receipt component
const InvoiceThermalReceipt = React.forwardRef<HTMLDivElement, ReceiptProps>((props, ref) => (
  <div
    ref={ref} 
    style={{
      width: '352px',
      padding: '15px',
      border: '2px solid grey',
      margin: '10px auto',
      boxSizing: 'border-box',
    }}
  >
    <table style={{ width: '100%',color:'#000000' }}>
      <tbody>
        <tr>
          <td style={{ textAlign: 'center' }}>
            <img src={props.printinvoice.logourl} alt="logo" style={{height: '82px', width: '158px'}} />
          </td>
        </tr>
        <tr>
          <td style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', margin: '0px', fontWeight: '900', marginTop: "10px" }}>
              {props.printinvoice.branchname}
            </p>
          </td>
        </tr>
        <tr>
          <td style={{ textAlign: 'center' }}>
            {/* <p style={{ fontSize: '14px', margin: '0px', fontWeight: '400' }}>
             {props.printinvoice.branchaddr}
            </p> */}
            {props.printinvoice.branchaddr?props.printinvoice.branchaddr.split('\n').map((item, i) => <p style={{ fontSize: '14px', margin: '0px', fontWeight: '400' }} key={i}>{item}</p>):null}
              
          </td>
        </tr>
        <tr>
          <td style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', margin: '0px', fontWeight: '900' }}>
             {props.printinvoice.orgname}
            </p>
          </td>
        </tr>
        <tr>
          <td style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', marginTop: '-8px', fontWeight: '400' }}>
              Mobile: {props.printinvoice.telephone}
            </p>
          </td>
        </tr>
        {/* <tr>
          <td style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', marginTop: '-8px', fontWeight: '400' }}>
              {taxName.value}: {data.organisationTaxID}
            </p>
          </td>
        </tr> */}
       {props.printinvoice.taxid !=='' ?<tr>
          <td style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', marginTop: '-8px', fontWeight: '400' }}>
              {`${props.printinvoice.taxname}: IN:  ${props.printinvoice.taxid}`}
            </p>
          </td>
        </tr>:null}
        <tr>
          <td style={{ textAlign: 'center' }}>
            <p
              style={{
                fontSize: '14px',
                margin: '0px',
                fontWeight: '600',
                // marginTop: '10px',
              }}
            >
              Bill No: {props.printinvoice.billno}
            </p>
          </td>
        </tr>
        <tr>
          <td style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', margin: '0px', fontWeight: '400' }}>
              PaymentMethod: {props.printinvoice?.paymenttype}
            </p>
          </td>
        </tr>
        {props.printinvoice.authcode !=='' ?<tr>
          <td style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', margin: '0px', fontWeight: '400' }}>
              Authcode: {props.printinvoice?.authcode}
            </p>
          </td>
        </tr>:null}
        <br />
        <tr>
          <td style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '14px', margin: '0px', fontWeight: '400' }}>
              Date: {props.printinvoice?.date}
            </p>
          </td>
        </tr>
        <tr>
          <td style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '14px', margin: '0px', fontWeight: '400' }}>
              Guest: {props.printinvoice?.guestname}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <table style={{ width: '100%', borderSpacing: '0px', marginTop: '10px',borderColor:'#000000',color:'#000000' }}>
      <thead>
        <tr>
          <th
            style={{
              fontSize: '13px',
              padding: '6px 0px',
              borderTop: '1px solid #333',
              borderBottom: '1px solid #333',
            }}
          >
            No
          </th>
          <th
            style={{
              fontSize: '13px',
              padding: '6px 0px',
              borderTop: '1px solid #333',
              borderBottom: '1px solid #333',
            }}
          >
            Item
          </th>
          <th
            style={{
              fontSize: '13px',
              textAlign: 'center',
              padding: '6px 0px',
              borderTop: '1px solid #333',
              borderBottom: '1px solid #333',
            }}
          >
            Price
          </th>
          <th
            style={{
              fontSize: '13px',
              textAlign: 'center',
              padding: '6px 0px',
              borderTop: '1px solid #333',
              borderBottom: '1px solid #333',
            }}
          >
            Qty
          </th>
          <th
            style={{
              whiteSpace: 'nowrap',
              fontSize: '13px',
              textAlign: 'right',
              padding: '6px 0px',
              borderTop: '1px solid #333',
              borderBottom: '1px solid #333',
            }}
          >
            Sub Total
          </th>
        </tr>
      </thead>
      <tbody>
        {(props.printinvoice.itemlist || []).map((item, index) => <tr>
          <td
            style={{
              fontSize: '13px',
              padding: '6px 0px',
              borderBottom: '1px solid #333',
            }}
          >
            {item[0]}
          </td>
          <td
            style={{
              fontSize: '13px',
              padding: '6px 0px',
              borderBottom: '1px solid #333',
            }}
          >
            {item[1]}
          </td>
          <td
            style={{
              fontSize: '13px',
              textAlign: 'center',
              padding: '6px 0px',
              borderBottom: '1px solid #333',
            }}
          >
            {item[2]}
          </td>
          <td
            style={{
              fontSize: '13px',
              textAlign: 'center',
              padding: '6px 0px',
              borderBottom: '1px solid #333',
            }}
          >
            {item[3]}
          </td>
          <td
            style={{
              fontSize: '13px',
              textAlign: 'right',
              padding: '6px 0px',
              borderBottom: '1px solid #333',
            }}
          >
            {item[4]}
          </td>
        </tr>)}
        <tr style={{borderBottom: '1px solid #333 !important',fontWeight:'900'}}>
          <td colSpan={2}  style={{borderBottom: '1px solid #333', }} />
          <td style={{ fontSize: '13px', textAlign: 'right', padding: '2px 0px',borderBottom: '1px solid #333'}}>Total</td>
          <td style={{borderBottom: '1px solid #333'}} />
          <td style={{ fontSize: '13px', textAlign: 'right', padding: '2px 0px',borderBottom: '1px solid #333' }}>{props.printinvoice.total}</td>
        </tr>
       {props.printinvoice.discount ===''?null:<tr>
          <td colSpan={2} />
          <td style={{ fontSize: '13px', textAlign: 'right', padding: '2px 0px' }}>Discount</td>
          <td />
          <td style={{ fontSize: '13px', textAlign: 'right', padding: '2px 0px' }}>{props.printinvoice.discount}</td>
        </tr>}
       {props.printinvoice.tip===''?null: <tr>
          <td colSpan={2} />
          <td style={{ fontSize: '13px', textAlign: 'right', padding: '2px 0px' }}>Tip</td>
          <td />
          <td style={{ fontSize: '13px', textAlign: 'right', padding: '2px 0px' }}>{props.printinvoice.tip}</td>
        </tr>}
        <tr>
          <td colSpan={2} />
          <td style={{ fontSize: '13px', textAlign: 'right', padding: '2px 0px' }}>{props.printinvoice.taxname|| 'Tax'}</td>
          <td />
          <td style={{ fontSize: '13px', textAlign: 'right', padding: '2px 0px' }}>{props.printinvoice.tax}</td>
        </tr>
        {/* <tr>
          <td colSpan={2}></td>
          <td style={{ fontSize: '13px', textAlign: 'right', padding: '2px 0px' }}>Total</td>
          <td></td>
          <td style={{ fontSize: '13px', textAlign: 'right', padding: '2px 0px' }}>{data.total.toFixed(2)}</td>
        </tr> */}
        <tr>
          <td
            style={{
              borderTop: '1px solid #333',
              borderBottom: '1px solid #333',
              fontWeight:'900'
            }}
          />
          <td
            colSpan={2}
            style={{
              fontSize: '15px',
              textAlign: 'right',
              fontWeight: '600',
              padding: '8px 0px',
              borderTop: '1px solid #333',
              borderBottom: '1px solid #333',
            }}
          >
            Bill Amount
          </td>
          <td
            style={{
              borderTop: '1px solid #333',
              borderBottom: '1px solid #333',
            }}
          />
          <td
            style={{
              fontSize: '15px',
              textAlign: 'right',
              fontWeight: '600',
              padding: '8px 0px',
              borderTop: '1px solid #333',
              borderBottom: '1px solid #333',
            }}
          >
            {props.printinvoice.billamount}
          </td>
        </tr>
      </tbody>
    </table>
    <table style={{ width: '100%' }}>
      <tbody>
      {props.printinvoice.customersavings === ''? null:<tr>
          <td style={{ textAlign: 'center' }}>
            <p
              style={{
                fontSize: '16px',
                margin: '0px',
                fontWeight: '600',
                marginTop: '15px',
              }}
            >
              Your Savings : {props.printinvoice.customersavings}
            </p>
          </td>
        </tr>}
       
        <tr>
          <td style={{ textAlign: 'center' }}>
            <p
              style={{
                fontSize: '16px',
                margin: '0px',
                fontWeight: '600',
                marginTop: '15px',
              }}
            >
              Thank You
            </p>
          </td>
        </tr>
        <tr>
          <td style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', margin: '0px', fontWeight: '400' }}>
              Please Visit Again
            </p>
          </td>
        </tr>
        <tr>
          <td style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', margin: '0px', fontWeight: '400' }}>
              Have a nice day
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
));


InvoiceThermalReceipt.displayName = 'Receipt';

export default InvoiceThermalReceipt;