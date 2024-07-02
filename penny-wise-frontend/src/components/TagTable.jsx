import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { TransactionCard } from "./TransactionCard";
import zIndex from "@mui/material/styles/zIndex";

export const TagTable = (props) => {
    var count=1
	return (
		<TableContainer component={Paper} sx={{}}>
			
			<Table sx={{ minWidth: 600 }} aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell align='center'>S.No</TableCell>
						<TableCell align='center'>Name</TableCell>
						<TableCell align='center'>Type</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{props.tags.map((tag) => {
                        var flag=false
                        switch (props.type){
                            case 'Income':
                                if (tag.tagType==='Income'){
                                    flag=true
                                    
                                }
                                break
                            case 'Expense':
                                if (tag.tagType==='Expense'){
                                    flag=true  
                                }
                                break
                            default:
                                flag=true
                                break
                        }
                        if (flag){
                            return (<TableRow key={tag.tgID}>
                                <TableCell align='center'>{count++}</TableCell>
                                <TableCell align='center'> {tag.tagName}</TableCell>
                                <TableCell align='center'>{tag.tagType}</TableCell>
                            </TableRow>)
                        }
						
                    })}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
